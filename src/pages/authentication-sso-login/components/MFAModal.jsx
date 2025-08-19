import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MFAModal = ({ isOpen, onClose, onVerify, method = 'app' }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [isOpen, timeLeft]);

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      await onVerify(code);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimeLeft(30);
    setCanResend(false);
    // Trigger resend logic
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Multi-Factor Authentication
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name={method === 'sms' ? 'Smartphone' : 'Shield'} size={24} className="text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            {method === 'sms' ?'Enter the 6-digit code sent to your registered phone number' :'Enter the 6-digit code from your authenticator app'
            }
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Verification Code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e?.target?.value?.replace(/\D/g, '')?.slice(0, 6))}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />

          <Button
            variant="default"
            fullWidth
            onClick={handleVerify}
            loading={isLoading}
            disabled={code?.length !== 6}
          >
            Verify Code
          </Button>

          <div className="text-center">
            {canResend ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                className="text-primary"
              >
                Resend Code
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend code in {timeLeft}s
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 p-3 bg-muted rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-accent mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Having trouble?</p>
              <p>Contact IT support at ext. 2847 or use backup codes if available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFAModal;