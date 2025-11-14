import React, { useState } from 'react';
import Button from '../Button';
import { CheckIcon, CopyIcon } from '../Icons';
import { copyToClipboard } from '../../utils/clipboard';
import { useToast } from '../../hooks/useToast';

const ResponseBlock = ({ title, content }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      showToast('Copied to clipboard!', 'success', 2000);
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Failed to copy', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">📧 {title}</h3>
        <Button variant="secondary" onClick={handleCopy} className="text-xs px-3 py-1">
          {copied ? <CheckIcon className="w-4 h-4 text-success-green" /> : <CopyIcon className="w-4 h-4" />}
          <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </div>
      <pre className="text-sm text-gray-950 font-sans p-6 bg-gray-50 border border-gray-200 rounded-md overflow-x-auto whitespace-pre-wrap max-h-[400px]">
        {content}
      </pre>
    </div>
  );
};

const CustomerResponseCard = () => {
  const [activeTab, setActiveTab] = useState('initial');

  const initialResponse = `Hi Michelle,

My name is Michael Hoang, Cleo support engineer. I've received your ticket about the John Deere ASN rejection issue for part AXE21152. Let me take a look at what's going on with your ASN formatting. I'll get back to you shortly with my findings.

Best regards,
Michael Hoang
Cleo Support Engineer`;

  const followUpResponse = `Hi Michelle,

I've identified the issue causing John Deere to show "No ASN" for your shipments. The problem is in how the line item information is being formatted in the LIN segment of your 856 ASN.

Specifically, the specification requires [DETAIL] but your file is sending [DETAIL].

To fix this, please adjust your mapping to [RESOLUTION].

Let me know if you have any questions.

Best regards,
Michael Hoang
Cleo Support Engineer`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 hover:shadow-lg transition-shadow duration-150">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-950">Customer Response</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'initial' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('initial')}
            className="text-sm"
          >
            Initial Response
          </Button>
          <Button
            variant={activeTab === 'follow-up' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('follow-up')}
            className="text-sm"
          >
            Follow-up Response
          </Button>
        </div>
      </div>

      {activeTab === 'initial' && (
        <ResponseBlock title="Initial Customer Response (Acknowledgment)" content={initialResponse} />
      )}

      {activeTab === 'follow-up' && (
        <ResponseBlock title="Follow-up Customer Response (Investigation Results)" content={followUpResponse} />
      )}
    </div>
  );
};

export default CustomerResponseCard;
