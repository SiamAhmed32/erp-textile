'use client';

import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import ButtonPrimary from './ButtonPrimary';

interface ContactButtonsProps {
  emailHref?: string;
  callHref?: string;
  whatsappHref?: string;
  className?: string;
}

const ContactButtons: React.FC<ContactButtonsProps> = ({
  emailHref = '#',
  callHref = '#',
  whatsappHref = '#',
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 mt-6 ${className}`}>
      <ButtonPrimary href={emailHref} icon={<Mail className="w-4 h-4" />}>
        EMAIL
      </ButtonPrimary>
      <ButtonPrimary href={callHref} icon={<Phone className="w-4 h-4" />}>
        CALL
      </ButtonPrimary>
      <ButtonPrimary href={whatsappHref} icon={<FaWhatsapp className="w-4 h-4" />}>
        WhatsApp
      </ButtonPrimary>
    </div>
  );
};

export default ContactButtons;
