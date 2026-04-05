import { useState } from 'react';
import { Download, ExternalLink, FileText, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentViewerProps {
  url: string;
  title?: string;
  downloadLabel?: string;
  className?: string;
}

function getViewerUrl(url: string): string {
  const lower = url.toLowerCase();
  // PDF can be viewed natively in browser
  if (lower.endsWith('.pdf')) {
    return url;
  }
  // PPT/PPTX use Google Docs Viewer
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
}

export default function DocumentViewer({ url, title, downloadLabel = '下载文件', className }: DocumentViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  const isPdf = url.toLowerCase().endsWith('.pdf');

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          {title && <span className="font-medium text-foreground">{title}</span>}
          <span className="text-xs">({isPdf ? 'PDF' : 'PPT'})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8"
          >
            {expanded ? <Minimize2 className="h-4 w-4 mr-1" /> : <Maximize2 className="h-4 w-4 mr-1" />}
            {expanded ? '收起' : '展开'}
          </Button>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-8">
              <ExternalLink className="h-4 w-4 mr-1" />
              新窗口
            </Button>
          </a>
          <a href={url} download target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" />
              {downloadLabel}
            </Button>
          </a>
        </div>
      </div>

      {/* Viewer */}
      <div
        className={cn(
          'relative w-full border border-border rounded-lg overflow-hidden bg-muted transition-all duration-300',
          expanded ? 'h-[80vh]' : 'h-[400px] md:h-[500px]'
        )}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <div className="text-center space-y-2">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground">加载文档中...</p>
            </div>
          </div>
        )}
        <iframe
          src={getViewerUrl(url)}
          className="w-full h-full"
          onLoad={() => setLoading(false)}
          title={title || 'Document Viewer'}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}
