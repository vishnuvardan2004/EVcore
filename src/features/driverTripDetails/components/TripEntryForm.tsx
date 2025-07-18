
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useTripDetails } from '../../../contexts/TripDetailsContext';

interface TripEntryFormProps {
  onSubmit: () => void;
}

export const TripEntryForm: React.FC<TripEntryFormProps> = ({ onSubmit }) => {
  const { addTrip } = useTripDetails();
  const [formData, setFormData] = useState({
    mode: '',
    amount: 0,
    tip: 0,
    paymentMode: '',
    partPaymentEnabled: false,
    amount1: 0,
    amount1Mode: '',
    amount2: 0,
    amount2Mode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tripModes = [
    'EVZIP App',
    'Rental Package',
    'Subscription',
    'Airport',
    'UBER',
    'Rapido'
  ];

  const paymentModes = [
    'Cash',
    'UPI - QR',
    'Wallet',
    'Card',
    'Uber'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.mode) newErrors.mode = 'Trip mode is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Trip amount must be greater than 0';
    if (!formData.paymentMode) newErrors.paymentMode = 'Payment mode is required';
    
    if (formData.partPaymentEnabled) {
      if (!formData.amount1 || formData.amount1 <= 0) newErrors.amount1 = 'Amount 1 is required';
      if (!formData.amount1Mode) newErrors.amount1Mode = 'Amount 1 payment mode is required';
      if (!formData.amount2 || formData.amount2 <= 0) newErrors.amount2 = 'Amount 2 is required';
      if (!formData.amount2Mode) newErrors.amount2Mode = 'Amount 2 payment mode is required';
      
      if (formData.amount1 + formData.amount2 !== formData.amount) {
        newErrors.partPayment = 'Part payment amounts must sum to total amount';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const trip = {
        id: Date.now().toString(),
        mode: formData.mode,
        amount: formData.amount,
        tip: formData.tip,
        paymentMode: formData.paymentMode,
        partPayment: formData.partPaymentEnabled ? {
          enabled: true,
          amount1: formData.amount1,
          amount1Mode: formData.amount1Mode,
          amount2: formData.amount2,
          amount2Mode: formData.amount2Mode,
        } : undefined,
      };
      
      addTrip(trip);
      setFormData({
        mode: '',
        amount: 0,
        tip: 0,
        paymentMode: '',
        partPaymentEnabled: false,
        amount1: 0,
        amount1Mode: '',
        amount2: 0,
        amount2Mode: '',
      });
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Trip Mode <span className="text-red-500">*</span></Label>
          <Select value={formData.mode} onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}>
            <SelectTrigger className={errors.mode ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select trip mode" />
            </SelectTrigger>
            <SelectContent>
              {tripModes.map((mode) => (
                <SelectItem key={mode} value={mode}>{mode}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.mode && <p className="text-sm text-red-500">{errors.mode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Trip Amount <span className="text-red-500">*</span></Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={formData.amount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
            className={errors.amount ? 'border-red-500' : ''}
          />
          {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tip">Tip (Optional)</Label>
          <Input
            id="tip"
            type="number"
            placeholder="Enter tip amount"
            value={formData.tip || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, tip: parseFloat(e.target.value) || 0 }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Mode <span className="text-red-500">*</span></Label>
          <RadioGroup 
            value={formData.paymentMode} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMode: value }))}
            className="flex flex-wrap gap-4"
          >
            {paymentModes.map((mode) => (
              <div key={mode} className="flex items-center space-x-2">
                <RadioGroupItem value={mode} id={mode} />
                <Label htmlFor={mode} className="text-sm">{mode}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.paymentMode && <p className="text-sm text-red-500">{errors.paymentMode}</p>}
        </div>
      </div>

      {/* Part Payment Section */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="partPayment"
            checked={formData.partPaymentEnabled}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, partPaymentEnabled: checked }))}
          />
          <Label htmlFor="partPayment">Enable Part Payment</Label>
        </div>

        {formData.partPaymentEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="amount1">Amount 1 <span className="text-red-500">*</span></Label>
              <Input
                id="amount1"
                type="number"
                placeholder="Enter amount 1"
                value={formData.amount1 || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, amount1: parseFloat(e.target.value) || 0 }))}
                className={errors.amount1 ? 'border-red-500' : ''}
              />
              {errors.amount1 && <p className="text-sm text-red-500">{errors.amount1}</p>}
            </div>

            <div className="space-y-2">
              <Label>Amount 1 Mode <span className="text-red-500">*</span></Label>
              <Select value={formData.amount1Mode} onValueChange={(value) => setFormData(prev => ({ ...prev, amount1Mode: value }))}>
                <SelectTrigger className={errors.amount1Mode ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI - QR">UPI - QR</SelectItem>
                </SelectContent>
              </Select>
              {errors.amount1Mode && <p className="text-sm text-red-500">{errors.amount1Mode}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount2">Amount 2 <span className="text-red-500">*</span></Label>
              <Input
                id="amount2"
                type="number"
                placeholder="Enter amount 2"
                value={formData.amount2 || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, amount2: parseFloat(e.target.value) || 0 }))}
                className={errors.amount2 ? 'border-red-500' : ''}
              />
              {errors.amount2 && <p className="text-sm text-red-500">{errors.amount2}</p>}
            </div>

            <div className="space-y-2">
              <Label>Amount 2 Mode <span className="text-red-500">*</span></Label>
              <Select value={formData.amount2Mode} onValueChange={(value) => setFormData(prev => ({ ...prev, amount2Mode: value }))}>
                <SelectTrigger className={errors.amount2Mode ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI - QR">UPI - QR</SelectItem>
                </SelectContent>
              </Select>
              {errors.amount2Mode && <p className="text-sm text-red-500">{errors.amount2Mode}</p>}
            </div>

            {errors.partPayment && (
              <div className="col-span-2">
                <p className="text-sm text-red-500">{errors.partPayment}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Add Trip
        </Button>
        <Button type="button" variant="outline" onClick={onSubmit}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
