import React, { useState } from 'react';
import { CheckIcon, CopyIcon } from '../Icons';
import Button from '../Button';
import { copyToClipboard } from '../../utils/clipboard';
import { useToast } from '../../hooks/useToast';

const TicketExtractionCard = () => {
  const [copied, setCopied] = useState(null);
  const { showToast } = useToast();

  const handleCopy = async (text, id) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(id);
      showToast('Copied to clipboard!', 'success', 2000);
      setTimeout(() => setCopied(null), 2000);
    } else {
      showToast('Failed to copy', 'error');
    }
  };

  const sections = [
    { id: 'verification', title: "Verification Status", emoji: "✓", content: "• Ticket PDF matches WebEDI Admin HTML: PASS VERIFIED\n• All files inventoried: 3 files found" },
    { id: 'customer', title: "Customer Information", emoji: "📋", content: "• Customer Name: Michelle Rice\n• Company Name: Vee Engineering\n• Customer ID (WebEDI ID): 5035\n• Phone: (765) 778-7895\n• Email: mrice@plant4.com" },
    { id: 'partners', title: "Trading Partners", emoji: "🔗", content: "• John Deere AG Waterloo" },
    { id: 'docs', title: "Document Types", emoji: "📄", content: "• 856 ASN (Ship Notice/Manifest)" },
    { id: 'error', title: "Error/Issue Reported", emoji: "⚠️", content: "LIN segment formatting error causing ASN rejection" },
    { id: 'desc', title: "Ticket Description", emoji: "📖", content: "Customer submitted ASN transactions to John Deere but system showed \"No ASN\" status. John Deere contact identified LIN segment formatting did not match specification requirements." },
    { id: 'integration', title: "Integration Type", emoji: "🔌", content: "• Outbound 856 ASN to John Deere via AS2B" },
    { id: 'priority', title: "Priority", emoji: "🔥", content: <span className="inline-block px-4 py-1 text-sm font-medium text-white bg-error-red rounded-full">HIGH</span> },
    { id: 'files', title: "Files Found (3)", emoji: "📎", content: "• ticket_13690386.pdf - 2.3 MB\n• WebEDI Admin 3.5.html - 61 KB\n• screenshot_error.png - 450 KB" },
  ];

  const allContent = sections
    .map(s => `${s.title}\n${typeof s.content === 'string' ? s.content : ''}`)
    .join('\n\n');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 hover:shadow-lg transition-shadow duration-150">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-950">Ticket Extraction</h2>
        <Button onClick={() => handleCopy(allContent, 'all')}>
          {copied === 'all' ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
          <span className="ml-2">{copied === 'all' ? 'Copied!' : 'Copy All'}</span>
        </Button>
      </div>
      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span role="img" aria-label={section.title}>{section.emoji}</span>
                <h3 className="text-[12px] font-semibold uppercase text-gray-700 tracking-wider">{section.title}</h3>
              </div>
              {typeof section.content === 'string' && (
                <button
                  onClick={() => handleCopy(section.content, section.id)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  {copied === section.id ? <CheckIcon className="w-3 h-3 text-green-500" /> : <CopyIcon className="w-3 h-3" />}
                  {copied === section.id ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            {typeof section.content === 'string' ? (
              <div className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {section.content.split('\n').map((line, i) => (
                  <span key={i} className="block ml-4 first:ml-0">
                    {line}
                  </span>
                ))}
              </div>
            ) : (
              <div>{section.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketExtractionCard;
