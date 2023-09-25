import React from 'react';

export const createSurfaceRenderer = (SurfaceComponent, surfaceRenderer) =>
  function Surface(blocks, conditions = {}) {
    return (
      <SurfaceComponent>
        {surfaceRenderer.render(blocks, {
          engine: 'rocket.chat',
          ...conditions,
        })}
      </SurfaceComponent>
    );
  };
