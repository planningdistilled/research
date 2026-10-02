# /// script
# requires-python = ">=3.11"
# dependencies = ["pyobjc-framework-Vision", "pyobjc-framework-Quartz"]
# ///
"""OCR a scanned PDF with macOS Vision (no tesseract needed). macOS only.

Many council officer reports (most Stratford delegated reports among them) are scanned images with no
text layer, so pdftotext returns nothing. This renders each page with Quartz and runs Vision's
VNRecognizeTextRequest, writing a text file with a `=== PAGE n ===` marker before each page.
Those markers equal PDF page numbers, which is what case files cite as p.N.

    uv run tools/ocr_pdf.py IN.pdf [OUT.txt] [--first N] [--last N]

OUT defaults to IN with .txt. About 4 s a page.
"""
import argparse
import os
import sys

import Quartz
import Vision
from Foundation import NSURL


def page_image(page, scale=2.0):
    box = page.getBoxRect_(Quartz.kCGPDFMediaBox) if hasattr(page, 'getBoxRect_') else Quartz.CGPDFPageGetBoxRect(page, Quartz.kCGPDFMediaBox)
    w, h = int(box.size.width * scale), int(box.size.height * scale)
    ctx = Quartz.CGBitmapContextCreate(None, w, h, 8, 0, Quartz.CGColorSpaceCreateDeviceRGB(), Quartz.kCGImageAlphaPremultipliedLast)
    Quartz.CGContextSetRGBFillColor(ctx, 1, 1, 1, 1)
    Quartz.CGContextFillRect(ctx, Quartz.CGRectMake(0, 0, w, h))
    Quartz.CGContextScaleCTM(ctx, scale, scale)
    Quartz.CGContextDrawPDFPage(ctx, page)
    return Quartz.CGBitmapContextCreateImage(ctx)


def recognise(image):
    req = Vision.VNRecognizeTextRequest.alloc().init()
    req.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)
    req.setUsesLanguageCorrection_(True)
    handler = Vision.VNImageRequestHandler.alloc().initWithCGImage_options_(image, None)
    ok, err = handler.performRequests_error_([req], None)
    if not ok:
        raise RuntimeError(err)
    # Observations come back bottom-up in Vision's coordinate space; sort top-to-bottom, then left-to-right.
    obs = sorted(req.results() or [], key=lambda o: (-round(o.boundingBox().origin.y, 2), o.boundingBox().origin.x))
    return '\n'.join(o.topCandidates_(1)[0].string() for o in obs)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('pdf')
    ap.add_argument('out', nargs='?')
    ap.add_argument('--first', type=int, default=1)
    ap.add_argument('--last', type=int)
    a = ap.parse_args()
    doc = Quartz.CGPDFDocumentCreateWithURL(NSURL.fileURLWithPath_(os.path.abspath(a.pdf)))
    if doc is None:
        sys.exit(f'cannot open {a.pdf}')
    n = Quartz.CGPDFDocumentGetNumberOfPages(doc)
    last = min(a.last or n, n)
    out = a.out or os.path.splitext(a.pdf)[0] + '.txt'
    parts = []
    for i in range(a.first, last + 1):
        parts.append(f'=== PAGE {i} ===\n' + recognise(page_image(Quartz.CGPDFDocumentGetPage(doc, i))))
        print(f'page {i}/{last}', file=sys.stderr)
    with open(out, 'w') as f:
        f.write('\n\n'.join(parts) + '\n')
    print(f'{out}: {last - a.first + 1} pages')


if __name__ == '__main__':
    main()
