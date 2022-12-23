import {
  PrivateUserYearEntry,
  setPrivateUserEntry,
} from 'models/private/users/years/entries';

const EntryButton = (props: {
  userId: string;
  yearId: string;
  disabled: boolean;
}) => {
  const handleEntry = async () => {
    const userId = props.userId;
    const yearId = props.yearId;
    const privateUserEntry: PrivateUserYearEntry = {
      id: userId,
      yearId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setPrivateUserEntry(userId, yearId, privateUserEntry);
  };

  return (
    <button
      className="btn btn-accent border-hidden outline-0 w-64 m-2"
      onClick={handleEntry}
      disabled={props.disabled}
    >
      Entry
    </button>
  );
};

export default EntryButton;
