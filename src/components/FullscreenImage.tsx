import React, { useState } from 'react';
import { Modal, Button } from 'antd';

type FullscreenImageModalprops = {
    isOpen: boolean,
    imageUrl: string,
    close: () => void
}
const FullscreenImageModal = ({isOpen, imageUrl, close} : FullscreenImageModalprops) => {
  return (
      <Modal
        open={isOpen}
        onCancel={close}
        footer={null}
        closable={false}
        width="100%"
        style={{ top: 0 }}
        styles={{
            content: {
                background: "rgba(0,0,0,0)"
            }
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={imageUrl}
            alt="image"
            style={{ width: '100%', maxHeight: 900, objectFit: 'contain', borderRadius: 10 }}
          />
          <Button
            type="primary"
            shape="round"
            onClick={close}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            X
          </Button>
        </div>
      </Modal>
  );
};

export default FullscreenImageModal;