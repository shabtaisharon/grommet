import React from 'react';

import { Box, Grommet, WorldMap } from 'grommet';
import { grommet } from 'grommet/themes';

export const Simple = () => {
  return (
    <Grommet theme={grommet}>
      <Box align="center" pad="large">
        <WorldMap />
      </Box>
    </Grommet>
  );
};

// chromatic disabled because snapshot is the same as SelectPlace
Simple.parameters = {
  chromatic: { disable: true },
};
