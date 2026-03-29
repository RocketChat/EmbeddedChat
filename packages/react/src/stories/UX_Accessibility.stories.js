import React, { useState } from 'react';
import { useFocusTrap } from '../lib/a11y/useFocusTrap';
import { MobileTouchTarget, useResponsive } from '../lib/mobile/useResponsive';
import { ThemeProvider, Box, ActionButton } from '@embeddedchat/ui-elements';
import DefaultTheme from '../theme/DefaultTheme';
import GlobalStyles from '../views/GlobalStyles';

export default {
  title: 'EmbeddedChat/POC: UX & Accessibility',
};

export const MobileUX_and_FocusTrap = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobile, vh } = useResponsive();
  const trapRef = useFocusTrap(isModalOpen);

  return (
    <ThemeProvider theme={DefaultTheme}>
      <GlobalStyles />
      <div style={{ padding: '2rem', background: '#f9f9f9', minHeight: '100vh' }}>
        <h3>Mobile UX & Accessibility POC</h3>
        <p>Current Viewport Status: <strong>{isMobile ? 'MOBILE' : 'DESKTOP'}</strong></p>
        <p>Calculated Dynamic Height: {vh}</p>

        <Box style={{ marginTop: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h4>Touch Area Optimization (Section 4.4)</h4>
          <p>This button is wrapped in a 44x44 safe zone for mobile users:</p>
          <MobileTouchTarget style={{ background: '#eee', border: '1px dashed #666' }}>
             <ActionButton icon="edit" />
          </MobileTouchTarget>
        </Box>

        <Box style={{ marginTop: '2rem' }}>
          <h4>Keyboard Focus Trap (Section 4.5)</h4>
          <button onClick={() => setIsModalOpen(true)}>Open Accessibile Modal POC</button>
          
          {isModalOpen && (
            <div 
              ref={trapRef} 
              style={{ 
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'white', padding: '2rem', border: '2px solid black', zIndex: 1000 
              }}
            >
              <h5>Focus is trapped here!</h5>
              <p>Try tabbing—your cursor will only stay between these fields:</p>
              <input type="text" placeholder="First focusable item" /><br /><br />
              <button>Second item</button><br /><br />
              <button onClick={() => setIsModalOpen(false)}>Close (Exit Trap)</button>
            </div>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
};
