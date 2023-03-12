// Todo: Team
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { PrivateUser } from 'models/private/users';
import { FaMinus, FaPlus } from 'react-icons/fa';

import { PrivateUserYearTeam } from 'models/private/users/years/teams';

const PrivateUserYearTeamCreateFormWidgetComponent = (props: {
  privateUser: PrivateUser;
  yearId: string;
}) => {
  const userId = props.privateUser.id;
  const yearId = props.yearId;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PrivateUserYearTeam>({
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
    },
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
    console.log(index);
    remove(index);
  };

  const onSubmit: SubmitHandler<PrivateUserYearTeam> = (privateUserYearTeam) =>
    console.log(privateUserYearTeam);

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
                <span className="label-text-alt">Bottom Left label</span>
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
                                <span className="label-text-alt">
                                  Bottom Left label
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
                                <span className="label-text-alt">
                                  Bottom Left label
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
                                <span className="label-text-alt">
                                  Bottom Left label
                                </span>
                                <span className="label-text-alt">
                                  Will be saved only off-chain
                                </span>
                              </label>

                              <button
                                className="btn btn-secondary inline-flex"
                                onClick={() => removeMember(index)}
                                type="button"
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
                <span className="label-text-alt">Bottom Left label</span>
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
