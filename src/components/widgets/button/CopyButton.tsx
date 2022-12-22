import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const CopyButtonComponent = (props: {
  copiedString: string | null | undefined;
}) => {
  const handleClickCopy = async (copiedString: string | null | undefined) => {
    if (!copiedString) {
      return;
    }
    await navigator.clipboard.writeText(copiedString);
  };

  return (
    <div className="tooltip tooltip-right" data-tip="Copy">
      <button
        className="btn btn-ghost btn-sm"
        onClick={async () => {
          await handleClickCopy(props.copiedString);
        }}
      >
        <FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>
      </button>
    </div>
  );
};

export default CopyButtonComponent;
