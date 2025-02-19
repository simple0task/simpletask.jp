// components/DeleteButton.tsx
import React from 'react';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';

interface DeleteButtonProps {
  onClick: (event: React.MouseEvent) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '18px',
        right: '18px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1000, // 他の要素よりも前面に表示
        borderRadius: '100%',
      }}
    >
      <Icon path={mdiTrashCanOutline} size={1} />
    </button>
  );
};

export default DeleteButton;
