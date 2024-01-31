
import { useCalendarStore } from '../../hooks'

export const FabDelete = () => {

  const { startDeletingEvent, hasEventSelected, isDateModalOpen } = useCalendarStore();

  const handleDetele = () => {
    startDeletingEvent();
  }

  return (
    <button
        className="btn btn-danger fab-danger"
        onClick={ handleDetele }
        style={{
          display: (hasEventSelected && !isDateModalOpen ) ? '' : 'none',
        }}
    >
        <i className="fas fa-trash-alt"></i>
    </button>
  )
};
