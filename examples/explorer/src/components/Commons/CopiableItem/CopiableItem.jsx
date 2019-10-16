import React, { useState } from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './copiableItem.scss';

const CopiableItem = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const tooltipMsg = copied ? 'Copied!' : 'Copy to clipboard';

  return (
    <div>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        onExited={() => setCopied(false)}
        overlay={<Tooltip id="tooltip-disabled">{tooltipMsg}</Tooltip>}
      >
        <CopyToClipboard {...{ text, onCopy: () => setCopied(true) }}>
          <div className="copiableItem">{text}</div>
        </CopyToClipboard>
      </OverlayTrigger>
    </div>
  );
};

export default CopiableItem;
