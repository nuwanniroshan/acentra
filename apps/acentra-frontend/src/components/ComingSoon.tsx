import React, { useState, useEffect } from 'react';
import {
  AuroraBox,
  AuroraTypography,
  AuroraCard,
  AuroraLiveIconClock8,
  AuroraLiveIconRocket,
  AuroraDivider,
} from '@acentra/aurora-design-system';

interface ComingSoonProps {
  moduleName: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ moduleName }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuroraBox
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        p: 2,
      }}
    >
      <AuroraCard
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <AuroraBox sx={{ mb: 3 }}>
          <AuroraLiveIconRocket
            width={64}
            height={64}
            stroke="#1976d2"
          />
        </AuroraBox>
        <AuroraTypography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          {moduleName} Coming Soon
        </AuroraTypography>
        <AuroraTypography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We're working hard to bring you an amazing {moduleName.toLowerCase()} experience.
        </AuroraTypography>
        <AuroraDivider sx={{ my: 3 }} />
        <AuroraTypography variant="h6" sx={{ mb: 2 }}>
          Launch Countdown
        </AuroraTypography>
        <AuroraBox
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <AuroraBox sx={{ textAlign: 'center' }}>
            <AuroraTypography variant="h4" sx={{ fontWeight: 'bold' }}>
              {timeLeft.days}
            </AuroraTypography>
            <AuroraTypography variant="caption" color="text.secondary">
              Days
            </AuroraTypography>
          </AuroraBox>
          <AuroraBox sx={{ textAlign: 'center' }}>
            <AuroraTypography variant="h4" sx={{ fontWeight: 'bold' }}>
              {timeLeft.hours}
            </AuroraTypography>
            <AuroraTypography variant="caption" color="text.secondary">
              Hours
            </AuroraTypography>
          </AuroraBox>
          <AuroraBox sx={{ textAlign: 'center' }}>
            <AuroraTypography variant="h4" sx={{ fontWeight: 'bold' }}>
              {timeLeft.minutes}
            </AuroraTypography>
            <AuroraTypography variant="caption" color="text.secondary">
              Minutes
            </AuroraTypography>
          </AuroraBox>
          <AuroraBox sx={{ textAlign: 'center' }}>
            <AuroraTypography variant="h4" sx={{ fontWeight: 'bold' }}>
              {timeLeft.seconds}
            </AuroraTypography>
            <AuroraTypography variant="caption" color="text.secondary">
              Seconds
            </AuroraTypography>
          </AuroraBox>
        </AuroraBox>
        <AuroraBox sx={{ mt: 3 }}>
          <AuroraLiveIconClock8 width={24} height={24} stroke="#1976d2" />
        </AuroraBox>
      </AuroraCard>
    </AuroraBox>
  );
};

export default ComingSoon;