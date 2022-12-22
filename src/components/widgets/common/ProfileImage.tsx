import DefaultProfileImage from '../../../images/default-profile-image.png';

const ProfileImageComponent = (props: { imageUrl: string | undefined }) => {
  return props.imageUrl ? (
    <img className="max-w-md h-auto" src={props.imageUrl} alt="Profile Image" />
  ) : (
    <img
      className="max-w-md h-auto"
      src={DefaultProfileImage}
      alt="Default Profile Image"
    />
  );
};

export default ProfileImageComponent;
