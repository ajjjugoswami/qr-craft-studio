import React from 'react';
import TemplateCard from './TemplateCard';
import { toast } from '@/hooks/use-toast';
import { defaultTemplates } from '@/types/qrcode';

interface FreeTemplatesProps {
  onApply: (styling: Partial<any>) => void;
}

const FreeTemplates: React.FC<FreeTemplatesProps> = ({ onApply }) => {
  // Pick three templates to show on the landing page
  const featuredIds = ['event-invitation-dark', 'business-card-modern', 'royal-navy'];
  const featured = defaultTemplates.filter((t) => featuredIds.includes(t.id));

  // Mark one or two as premium for demo purposes
  const premiumSet = new Set(['royal-navy']);

  const handleUse = (styling: Partial<any>, premium?: boolean) => {
    if (premium) {
      toast({ title: 'Premium template', description: 'Sign up to unlock premium templates.' });
      return;
    }
    onApply(styling);
    toast({ title: 'Template applied', description: 'The template was applied to your QR preview.' });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-medium">Templates</h3>
        <div className="text-xs sm:text-sm text-muted-foreground">Select a template to apply to your QR</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {featured.map((t) => (
          <TemplateCard key={t.id} template={t} premium={premiumSet.has(t.id)} onUse={handleUse} />
        ))}
      </div>
    </div>
  );
};

export default FreeTemplates;