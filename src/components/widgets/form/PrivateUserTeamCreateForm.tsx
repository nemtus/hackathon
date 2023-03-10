// Todo: Team
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { PrivateUser } from 'models/private/users';

type TeamInfo = {
  id?: string;
  name: string;
  members: MemberInfo[];
  addressForPrizeReceipt: string;
};

type MemberInfo = {
  id?: string;
  nickName: string;
  twitterId: string;
  githubId: string;
};

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
  } = useForm<TeamInfo>({
    defaultValues: {
      name: '',
      members: [
        {
          nickName: '',
          twitterId: '',
          githubId: '',
        },
      ],
      addressForPrizeReceipt: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  const addMember = () => {
    append({
      nickName: '',
      twitterId: '',
      githubId: '',
    });
  };

  const removeMember = (index: number) => {
    remove(index);
  };

  const onSubmit: SubmitHandler<TeamInfo> = (teamInfo) => console.log(teamInfo);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">NEMTUS Hackathon {yearId}</h2>
        <div className="card-content flex justify-start">
          Create Team of the NEMTUS Hackathon {yearId}.
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" {...register('name')} />
          {fields.map((field, index) => (
            <div key={field.id}>
              <input type="text" {...register(`members.${index}.nickName`)} />
              <input type="text" {...register(`members.${index}.twitterId`)} />
              <input type="text" {...register(`members.${index}.githubId`)} />
              <button onClick={() => removeMember(index)} type="button">
                Remove Member
              </button>
            </div>
          ))}
          <button onClick={addMember} type="button">
            Add Member
          </button>
          <input type="text" {...register('addressForPrizeReceipt')} />
          <button type="submit">Create Team</button>
        </form>
      </div>
    </div>
  );
};

export default PrivateUserYearTeamCreateFormWidgetComponent;
