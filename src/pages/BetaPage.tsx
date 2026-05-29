// src/pages/BetaPage.tsx
// Handles deep links: amysurfwing.de/#/beta/ERSTEWELLE
// Applies the beta code, then routes to onboarding (new user) or welcome screen (existing user).

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BETA_ACTIVE,
  BETA_CODES,
  isBetaTester,
  setPendingBetaCode,
} from '../beta/betaConfig';
import { isFirstRunDone } from '../common/firstRun';
import BetaWelcomeScreen from '../beta/BetaWelcomeScreen';

export default function BetaPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const upperCode = (code ?? '').toUpperCase();

  const isValid = BETA_ACTIVE && BETA_CODES.includes(upperCode);

  useEffect(() => {
    if (!isValid) {
      navigate('/', { replace: true });
      return;
    }

    // Already a beta tester — just go to the story
    if (isBetaTester()) {
      navigate('/stories-v02/s1e01/s1e01c01', { replace: true });
      return;
    }

    // New user — save pending code, start onboarding
    if (!isFirstRunDone()) {
      setPendingBetaCode(upperCode);
      navigate('/start', { replace: true });
    }
    // Existing user — show welcome screen (rendered below)
  }, []);

  if (!isValid) return null;

  // Existing user who hasn't seen the beta welcome yet
  if (isFirstRunDone() && !isBetaTester()) {
    return <BetaWelcomeScreen code={upperCode} />;
  }

  return null;
}
