'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface NotesEditorProps {
  propertyId: string;
  initialValue: string;
  onSave: (propertyId: string, text: string) => void;
  lastEdited?: string;
}

export default function NotesEditor({ 
  propertyId, 
  initialValue = '', 
  onSave,
  lastEdited 
}: NotesEditorProps) {
  const [text, setText] = useState(initialValue);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Update text when initialValue changes
  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);
  
  // Format date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Count words in text
  const countWords = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };
  
  // Simple Markdown-like formatter
  const formatText = (text: string) => {
    if (!text) return '';
    
    // Replace **bold** with <strong>bold</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *italic* with <em>italic</em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace # Heading with <h3>Heading</h3>
    formatted = formatted.replace(/^# (.*?)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>');
    
    // Replace - item with <li>item</li>
    formatted = formatted.replace(/^- (.*?)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/<li>(.*?)<\/li>/g, '<ul class="list-disc pl-5 my-2"><li>$1</li></ul>');
    
    // Replace ```code``` with <code>code</code>
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded my-2 font-mono text-sm overflow-x-auto">$1</pre>');
    
    // Replace new lines with <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };
  
  return (
    <div>
      <div className="flex mb-2 border-b">
        <button
          className={`px-3 py-1 ${!previewMode ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setPreviewMode(false)}
        >
          Edit
        </button>
        <button
          className={`px-3 py-1 ${previewMode ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setPreviewMode(true)}
        >
          Preview
        </button>
      </div>
      
      {!previewMode ? (
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 mb-2 font-mono"
          rows={8}
          placeholder="Add your notes about this property..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <div 
          className="w-full border border-gray-300 rounded-md p-3 mb-2 min-h-[200px] bg-white"
          dangerouslySetInnerHTML={{ __html: formatText(text) }}
        />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm">
        <div className="text-gray-500 mb-2 sm:mb-0">
          <span>
            {lastEdited ? `Last edited: ${formatDate(lastEdited)}` : 'No changes yet'}
          </span>
          <span className="mx-2">•</span>
          <span>
            {countWords(text)} words
          </span>
          <span className="mx-2">•</span>
          <span>
            {text.length} characters
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSave(propertyId, text)}
        >
          Save Notes
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">Formatting Tips:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use **bold** for bold text</li>
          <li>Use *italic* for italicized text</li>
          <li>Use # Heading for headings</li>
          <li>Use - item for bullet points</li>
          <li>Use ```code``` for code blocks</li>
        </ul>
      </div>
    </div>
  );
} 