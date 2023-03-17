import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PrivateUser } from 'models/private/users';
import {
  PrivateUserYearSubmission,
  setPrivateUserYearSubmission,
} from 'models/private/users/years/submissions';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from 'utils/firebase';
import { PrivateUserYearTeam } from 'models/private/users/years/teams';

const customValidationUrlOrEmptyString = yup
  .string()
  .trim()
  .test({
    name: 'url-or-empty-string',
    message: 'Please enter a valid URL or leave this field empty',
    test: (value: string | undefined) => {
      if (!value) {
        return true;
      }
      const urlRegex = /^https:\/\/[^ "]+$/;
      return urlRegex.test(value);
    },
  });

const schema = yup.object().shape({
  id: yup.string(),
  yearId: yup.string(),
  teamId: yup.string(),
  name: yup.string().required('Please enter the name of your work'),
  description: yup
    .string()
    .required('Please enter the description of your work')
    .max(140),
  url: yup
    .string()
    .required('Please enter the URL of your work')
    .url('Please enter a valid URL'),
  repositoryUrl: customValidationUrlOrEmptyString,
  storeRepositoryUrlOnChain: yup
    .boolean()
    .required('Please select store repository url on chain or off chain.'),
});

const PrivateUserYearSubmissionCreateFormWidgetComponent = (props: {
  privateUser: PrivateUser;
  privateUserYearTeam: PrivateUserYearTeam;
  yearId: string;
}) => {
  const userId = props.privateUser.id;
  const yearId = props.yearId;

  const navigate = useNavigate();
  const [imageDownloadUrl, setImageDownloadUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrivateUserYearSubmission>({
    mode: 'onChange',
    defaultValues: {
      id: userId,
      yearId,
      teamId: userId,
      name: '',
      description: '',
      url: '',
      imageUrl: '',
      repositoryUrl: '',
      storeRepositoryUrlOnChain: undefined,
      approved: false,
      createdAt: undefined,
      updatedAt: undefined,
      approvedAt: undefined,
    },
    resolver: yupResolver(schema),
  });

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) {
      setImageDownloadUrl('');
      return;
    }
    const storageRef = ref(
      storage,
      `users/${userId}/years/${yearId}/submissions/${userId}/images/${files[0].name}`
    );
    const snapshot = await uploadBytes(storageRef, files[0]);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    setImageDownloadUrl(downloadUrl);
  };

  const onSubmit: SubmitHandler<PrivateUserYearSubmission> = async (
    privateUserYearSubmission
  ): Promise<void> => {
    console.log(privateUserYearSubmission);
    if (!imageDownloadUrl) {
      alert('Please upload image!');
    }
    privateUserYearSubmission.imageUrl = imageDownloadUrl;
    const now = new Date();
    privateUserYearSubmission.createdAt = now;
    privateUserYearSubmission.updatedAt = now;
    privateUserYearSubmission.approvedAt = undefined;
    await setPrivateUserYearSubmission(userId, privateUserYearSubmission);
    navigate(`/private/users/${userId}`);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body flex flex-col justify-start max-w-md">
        <h2 className="card-title">
          Submit my work of the NEMTUS Hackathon {yearId}.
        </h2>
        {imageDownloadUrl ? (
          <figure>
            <img
              className="max-w-md h-auto"
              src={imageDownloadUrl}
              alt="Submission Image"
            />
          </figure>
        ) : null}
        <div className="card-content flex flex-col justify-start w-full max-w-xs">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name of my work</span>
                <span className="label-text-alt">Required</span>
              </label>
              <input
                type="text"
                placeholder="Example: Some awesome app"
                className="input w-full max-w-xs"
                {...register('name')}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.name?.message}
                </span>
                <span className="label-text-alt">
                  Will be stored in blockchain
                </span>
              </label>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Description of my work</span>
                <span className="label-text-alt">Required (max: 140)</span>
              </label>
              <textarea
                placeholder="Example: This is the app ..."
                className="textarea textarea-bordered w-full max-w-xs"
                {...register('description')}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.description?.message}
                </span>
                <span className="label-text-alt">
                  Will be stored in blockchain
                </span>
              </label>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">URL of my work</span>
                <span className="label-text-alt">Required</span>
              </label>
              <input
                type="text"
                placeholder="Example: https://awesome.app.example.com"
                className="input w-full max-w-xs"
                {...register('url')}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.url?.message}
                </span>
                <span className="label-text-alt">
                  Will be stored in blockchain
                </span>
              </label>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Image file of my work</span>
                <span className="label-text-alt">Required</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                accept="image/*"
                onChange={onChange}
                required
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {imageDownloadUrl ? '' : 'Upload image file of your work'}
                </span>
                <span className="label-text-alt">
                  Will be stored in blockchain
                </span>
              </label>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">URL of my work repository</span>
                <span className="label-text-alt">Optional</span>
              </label>
              <input
                type="text"
                placeholder="Example: https://github.com/nemtus/hackathon"
                className="input w-full max-w-xs"
                {...register('repositoryUrl')}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.repositoryUrl?.message}
                </span>
                <span className="label-text-alt">
                  Will be stored in blockchain
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  Store Repository URL On Chain
                </span>
                <input
                  type="radio"
                  className="radio checked:bg-green-500"
                  value="true"
                  {...register('storeRepositoryUrlOnChain')}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  Store Repository URL Off Chain
                </span>
                <input
                  type="radio"
                  className="radio checked:bg-red-500"
                  value="false"
                  {...register('storeRepositoryUrlOnChain')}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                {errors?.storeRepositoryUrlOnChain?.message ? (
                  <span className="label-text text-error">
                    {errors?.storeRepositoryUrlOnChain?.message}
                  </span>
                ) : null}
                <input
                  type="radio"
                  className="radio checked:bg-red-500"
                  value="undefined"
                  hidden
                  {...register('storeRepositoryUrlOnChain')}
                />
              </label>
            </div>

            <button className="btn btn-primary w-full max-w-xs" type="submit">
              Submit my work
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserYearSubmissionCreateFormWidgetComponent;
