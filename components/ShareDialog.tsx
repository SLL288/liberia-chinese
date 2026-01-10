"use client";

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ShareDialogProps = {
  url: string;
  title: string;
  locale: string;
};

export function ShareDialog({ url, title, locale }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{locale === 'zh' ? '分享' : 'Share'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{locale === 'zh' ? '微信分享' : 'Share'}</DialogTitle>
          <DialogDescription>
            {locale === 'zh'
              ? '复制链接发到群里，或保存二维码。'
              : 'Copy the link or share the QR code.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            {title}
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <QRCodeCanvas value={url} size={180} includeMargin />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={copyLink} className="flex-1">
              {copied ? (locale === 'zh' ? '已复制' : 'Copied') : locale === 'zh' ? '复制链接' : 'Copy link'}
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href={url} target="_blank" rel="noreferrer">
                {locale === 'zh' ? '打开链接' : 'Open link'}
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {locale === 'zh'
              ? '微信分享：复制链接发到群里，或保存二维码。'
              : 'WeChat sharing: send the link or save the QR code.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
