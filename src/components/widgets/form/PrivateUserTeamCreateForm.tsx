import {
  useForm,
  SubmitHandler,
  useFieldArray,
  FieldError,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PrivateUser } from 'models/private/users';
import { FaMinus, FaPlus } from 'react-icons/fa';
import {
  PrivateUserYearTeam,
  setPrivateUserYearTeam,
} from 'models/private/users/years/teams';
import { useNavigate } from 'react-router-dom';

const addressRegex =
  process.env.REACT_APP_SYMBOL_PREFIX === 'T'
    ? /^T[A-Z0-9]{38}$/
    : process.env.REACT_APP_SYMBOL_PREFIX === 'N'
    ? /^N[A-Z0-9]{38}$/
    : /^T[A-Z0-9]{38}$/;

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
  name: yup.string().required('Please enter a team name'),
  users: yup
    .array(
      yup.object().shape({
        id: yup.string(),
        displayName: yup
          .string()
          .required('Please enter a nick name of this member'),
        twitterId: yup
          .string()
          .required('Please enter a Twitter ID of this member')
          .url('Please enter a valid URL'),
        githubId: customValidationUrlOrEmptyString,
      })
    )
    .min(1, "Please enter at least one member's information"),
  addressForPrizeReceipt: yup
    .string()
    .required('Please enter a symbol address to receive prize')
    .length(39)
    .matches(addressRegex),
});

const PrivateUserYearTeamCreateFormWidgetComponent = (props: {
  privateUser: PrivateUser;
  yearId: string;
}) => {
  const userId = props.privateUser.id;
  const yearId = props.yearId;

  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrivateUserYearTeam>({
    mode: 'onChange',
    defaultValues: {
      id: userId,
      yearId: yearId,
      name: '',
      users: [
        {
          id: '',
          displayName: '',
          twitterId: '',
          githubId: '',
        },
      ],
      addressForPrizeReceipt: '',
      approved: false,
      createdAt: undefined,
      updatedAt: undefined,
      approvedAt: undefined,
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users',
  });

  const addMember = () => {
    append({
      id: '',
      displayName: '',
      twitterId: '',
      githubId: '',
    });
  };

  const removeMember = (index: number) => {
    remove(index);
  };

  const onSubmit: SubmitHandler<PrivateUserYearTeam> = async (
    privateUserYearTeam
  ): Promise<void> => {
    const now = new Date();
    privateUserYearTeam.createdAt = now;
    privateUserYearTeam.updatedAt = now;
    privateUserYearTeam.approvedAt = undefined;
    await setPrivateUserYearTeam(userId, privateUserYearTeam);
    navigate(`/private/users/${userId}`);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">
          Create Team of the NEMTUS Hackathon {yearId}.
        </h2>
        <div className="card-content flex flex-col justify-start">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Team name</span>
                <span className="label-text-alt">Required</span>
              </label>
              <input
                type="text"
                placeholder="Example: Team NEMTUS"
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

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title justify-start">Members List</h3>
                <div className="card-content flex flex-col justify-start">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h4 className="card-title justify-start">
                            Member {index + 1}
                          </h4>
                          <div className="card-content flex flex-col justify-start">
                            <div className="form-control w-full max-w-xs">
                              <label className="label">
                                <span className="label-text">
                                  Member {index + 1} Nick Name
                                </span>
                                <span className="label-text-alt">Required</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Example: NEMTUS"
                                className="input w-full max-w-xs"
                                {...register(`users.${index}.displayName`)}
                              />
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {(() => {
                                    if (!errors.users) {
                                      return;
                                    }
                                    if (!errors.users.length) {
                                      return;
                                    }
                                    if (errors.users.length <= index) {
                                      return;
                                    }
                                    const fieldErrors = errors.users[index]
                                      ?.displayName as FieldError | undefined;
                                    if (!fieldErrors) {
                                      return;
                                    }
                                    return fieldErrors?.message;
                                  })()}
                                </span>
                                <span className="label-text-alt">
                                  Will be stored in blockchain
                                </span>
                              </label>
                            </div>

                            <div className="form-control w-full max-w-xs">
                              <label className="label">
                                <span className="label-text">
                                  Member {index + 1} Twitter ID
                                </span>
                                <span className="label-text-alt">Required</span>
                              </label>
                              <input
                                type="txt"
                                placeholder="Example: https://twitter.com/NemtusOfficial"
                                className="input w-full max-w-xs"
                                {...register(`users.${index}.twitterId`)}
                              />
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {(() => {
                                    if (!errors.users) {
                                      return;
                                    }
                                    if (!errors.users.length) {
                                      return;
                                    }
                                    if (errors.users.length <= index) {
                                      return;
                                    }
                                    const fieldErrors = errors.users[index]
                                      ?.twitterId as FieldError | undefined;
                                    if (!fieldErrors) {
                                      return;
                                    }
                                    return fieldErrors?.message;
                                  })()}
                                </span>
                                <span className="label-text-alt">
                                  Will be stored in blockchain
                                </span>
                              </label>
                            </div>

                            <div className="form-control w-full max-w-xs">
                              <label className="label">
                                <span className="label-text">
                                  Member {index + 1} GitHub ID
                                </span>
                                <span className="label-text-alt">Optional</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Example: https://github.com/nemtus"
                                className="input w-full max-w-xs"
                                {...register(`users.${index}.githubId`)}
                              />
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {(() => {
                                    if (!errors.users) {
                                      return;
                                    }
                                    if (!errors.users.length) {
                                      return;
                                    }
                                    if (errors.users.length <= index) {
                                      return;
                                    }
                                    const fieldErrors = errors.users[index]
                                      ?.githubId as FieldError | undefined;
                                    if (!fieldErrors) {
                                      return;
                                    }
                                    return fieldErrors?.message;
                                  })()}
                                </span>
                                <span className="label-text-alt">
                                  Will be stored in blockchain
                                </span>
                              </label>

                              <button
                                className="btn btn-secondary inline-flex"
                                onClick={() => removeMember(index)}
                                type="button"
                                disabled={index === 0}
                              >
                                <FaMinus />
                                Remove Member
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn btn-accent inline-flex w-full max-w-xs"
                    onClick={addMember}
                    type="button"
                  >
                    <FaPlus />
                    Add Member
                  </button>
                </div>
              </div>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  Symbol address for prize receipt
                </span>
                <span className="label-text-alt">Required</span>
              </label>
              <input
                type="text"
                placeholder=""
                className="input w-full max-w-xs"
                {...register('addressForPrizeReceipt')}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.addressForPrizeReceipt?.message}
                </span>
                <span className="label-text-alt">
                  Will be stored in blockchain
                </span>
              </label>
            </div>

            <button className="btn btn-primary w-full max-w-xs" type="submit">
              Create Team
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserYearTeamCreateFormWidgetComponent;
