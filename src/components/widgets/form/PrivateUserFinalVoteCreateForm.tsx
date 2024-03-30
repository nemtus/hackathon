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
import { PrivateUserYearJudge } from 'models/private/users/years/judges';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PublicResults } from 'models/public/years/results';
import { AuthUser } from 'utils/firebase';
import { PrivateUserYearEntry } from 'models/private/users/years/entries';
import { PrivateUserYearTeam } from 'models/private/users/years/teams';
import { PrivateUserYearSubmission } from 'models/private/users/years/submissions';
import { PrivateUserYearVote } from 'models/private/users/years/votes';
import { PrivateUserYearFinalJudge } from 'models/private/users/years/final-judges';
import {
  PrivateUserYearFinalVote,
  setPrivateUserYearFinalVote,
} from 'models/private/users/years/final-votes';
import { ConfigHackathonYearEntry } from 'models/configs/hackathon/years/entry';
import { ConfigHackathonYearTeam } from 'models/configs/hackathon/years/team';
import { ConfigHackathonYearSubmission } from 'models/configs/hackathon/years/submission';
import { ConfigHackathonYearJudge } from 'models/configs/hackathon/years/judge';
import { ConfigHackathonYearVote } from 'models/configs/hackathon/years/vote';
import { Vote } from 'models/public/users/years/votes';
import { ConfigHackathonYearFinalJudge } from 'models/configs/hackathon/years/final-judge';
import { ConfigHackathonYearFinalVote } from 'models/configs/hackathon/years/final-vote';

const CURRENT_YEAR = process.env.REACT_APP_CURRENT_YEAR;

const schema = yup.object().shape({
  id: yup.string(),
  userId: yup.string(),
  yearId: yup.string(),
  votes: yup.array(
    yup.object().shape({
      id: yup.string(),
      userId: yup.string(),
      yearId: yup.string(),
      teamId: yup.string(),
      submissionId: yup.string(),
      point: yup.number().required().integer().min(0),
      message: yup.string().max(140),
    })
  ),
});

const PrivateUserFinalYearVoteCreateFormWidgetComponent = (props: {
  yearId: string;
  authUser: AuthUser;
  privateUser: PrivateUser;
  privateUserYearEntry: PrivateUserYearEntry | null | undefined;
  privateUserYearTeam: PrivateUserYearTeam | null | undefined;
  privateUserYearSubmission: PrivateUserYearSubmission | null | undefined;
  privateUserYearJudge: PrivateUserYearJudge | null | undefined;
  privateUserYearVote: PrivateUserYearVote | null | undefined;
  privateUserYearFinalJudge: PrivateUserYearFinalJudge | null | undefined;
  privateUserYearFinalVote: PrivateUserYearFinalVote | null | undefined;
  publicResults: PublicResults | [];
  configHackathonYearEntry: ConfigHackathonYearEntry;
  configHackathonYearTeam: ConfigHackathonYearTeam;
  configHackathonYearSubmission: ConfigHackathonYearSubmission;
  configHackathonYearJudge: ConfigHackathonYearJudge;
  configHackathonYearVote: ConfigHackathonYearVote;
  configHackathonYearFinalJudge: ConfigHackathonYearFinalJudge;
  configHackathonYearFinalVote: ConfigHackathonYearFinalVote;
}) => {
  const userId = props.privateUser.id;
  const yearId = props.yearId;

  const navigate = useNavigate();
  const [now, setNow] = useState<Date>(new Date());

  const isCreatableUser = () => {
    console.log({
      propsAuthUserUid: props.authUser.uid,
      propsYearId: props.yearId,
      propsPrivateUserYearSubmission: props.privateUserYearSubmission,
      propsPrivateUserYearJudge: props.privateUserYearJudge,
      propsPrivateUserYearVote: props.privateUserYearVote,
      propsPrivateUserYearFinalJudge: props.privateUserYearJudge,
      propsPrivateUserYearFinalVote: props.privateUserYearVote,
      propsConfigHackathonYearFinalVoteStartAt:
        props.configHackathonYearFinalVote.startAt,
      now,
      propsConfigHackathonYearFinalVoteEndAt:
        props.configHackathonYearFinalVote.endAt,
      propsConfigHackathonYearFinalJudgeUsers:
        props.configHackathonYearFinalJudge.users,

      userIsNotJudge: !props.configHackathonYearFinalJudge.users.some(
        (userId) =>
          userId === props.authUser.uid && userId === props.privateUser.id
      ),
    });
    console.log({
      propsAuthUserUid: props.authUser.uid === userId,
      propsYearId: props.yearId === CURRENT_YEAR,
      propsPrivateUserYearSubmission:
        props.privateUserYearSubmission === undefined,
      propsPrivateUserYearJudge: props.privateUserYearJudge === undefined,
      propsPrivateUserYearVote: props.privateUserYearVote !== undefined,
      propsPrivateUserYearFinalJudge:
        props.privateUserYearFinalJudge === undefined,
      propsPrivateUserYearFinalVote:
        props.privateUserYearFinalVote === undefined,
      propsConfigHackathonYearFinalVoteStartAt:
        props.configHackathonYearFinalVote.startAt <= now,
      now: now <= props.configHackathonYearFinalVote.endAt,
      userIsNotJudge: !props.configHackathonYearFinalJudge.users.some(
        (userId) =>
          userId === props.authUser.uid && userId === props.privateUser.id
      ),
    });
    return (
      props.authUser.uid === userId &&
      props.yearId === CURRENT_YEAR &&
      props.privateUserYearSubmission === undefined &&
      props.privateUserYearJudge === undefined &&
      props.privateUserYearVote !== undefined &&
      props.privateUserYearFinalJudge === undefined &&
      props.privateUserYearFinalVote === undefined &&
      props.configHackathonYearFinalVote.startAt <= now &&
      now <= props.configHackathonYearFinalVote.endAt &&
      !props.configHackathonYearFinalJudge.users.some(
        (userId) =>
          userId === props.authUser.uid && userId === props.privateUser.id
      )
    );
  };

  const isCreatablePrivateUserYearVote = (
    privateUserYearFinalVote: PrivateUserYearFinalVote
  ) => {
    const isPositive = !privateUserYearFinalVote.votes.some(
      (vote) => vote.point < 0 || !Number.isInteger(vote.point)
    );
    console.log({ isPositive });
    const isValidMessage = !privateUserYearFinalVote.votes.some((vote) => {
      console.log({ type: typeof vote.message });
      return typeof vote.message !== 'string';
    });
    console.log({ isValidMessage });
    const votes = privateUserYearFinalVote.votes.map((vote) =>
      parseInt(vote.point.toString())
    );
    const totalPoints = votes.length
      ? votes.reduce((acc, cur) => acc + cur)
      : 0;
    console.log({ totalPoints });
    console.log({ publicResultsLength: props.publicResults.length });
    const isValidTotalPoints = totalPoints === props.publicResults.length * 5;
    console.log({ isValidTotalPoints });
    return isPositive && isValidMessage && isValidTotalPoints;
  };

  const convertPublicResultsToInitialFinalVotes = (
    publicResults: PublicResults
  ) => {
    const finalVotes: Vote[] = publicResults.map((publicResult) => {
      return {
        id: publicResult.teamId,
        userId: props.authUser.uid,
        yearId: publicResult.yearId,
        teamId: publicResult.teamId,
        submissionId: publicResult.teamId,
        point: 0,
        message: '',
      };
    });
    return finalVotes;
  };

  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PrivateUserYearVote>({
    mode: 'onChange',
    defaultValues: {
      id: userId,
      userId: userId,
      yearId: yearId,
      votes: convertPublicResultsToInitialFinalVotes(props.publicResults),
      totalPoints: 0,
      approved: false,
      createdAt: undefined,
      updatedAt: undefined,
      approvedAt: undefined,
    },
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: 'votes',
  });

  const handleIncrementPoint = (index: number, increment: number) => {
    const currentPoint = getValues(`votes.${index}.point`);
    console.log({ currentPoint });
    const newPoint =
      parseInt(currentPoint.toString()) + parseInt(increment.toString());
    console.log({ newPoint });
    if (newPoint < 0) {
      alert('Point cannot be negative.');
      return;
    }
    setValue(`votes.${index}.point`, newPoint);

    const newVotes = getValues('votes');
    console.log({ newVotes });
    const votes = newVotes.map((vote) => parseInt(vote.point.toString()));
    const totalPoints = votes.length
      ? votes.reduce((acc, cur) => acc + cur)
      : 0;
    console.log({ totalPoints });
    if (totalPoints > newVotes.length * 5) {
      alert('Total points must be less than or equal to 5 x entry counts.');
      setValue(`votes.${index}.point`, currentPoint);
      const newVotes = getValues('votes');
      console.log({ newVotes });
      const votes = newVotes.map((vote) => parseInt(vote.point.toString()));
      const totalPoints = votes.length
        ? votes.reduce((acc, cur) => acc + cur)
        : 0;
      console.log({ totalPoints });
      return;
    }
  };

  const onSubmit: SubmitHandler<PrivateUserYearFinalVote> = async (
    privateUserYearFinalVote
  ): Promise<void> => {
    if (!isCreatableUser()) {
      alert(
        "You can't create a vote. Because you are not a submitter or the deadline has passed or you have already created a vote."
      );
      return;
    }
    if (!isCreatablePrivateUserYearVote(privateUserYearFinalVote)) {
      alert(
        "You can't create a vote. Because the vote is invalid. Please make sure that the number of points you have and the total number of points scored match. Please use up all the points you have."
      );
      return;
    }
    const now = new Date();
    privateUserYearFinalVote.createdAt = now;
    privateUserYearFinalVote.updatedAt = now;
    privateUserYearFinalVote.approvedAt = undefined;
    const votes = getValues('votes').map((vote) =>
      parseInt(vote.point.toString())
    );
    privateUserYearFinalVote.totalPoints = votes.length
      ? votes.reduce((acc, cur) => acc + cur)
      : 0;
    await setPrivateUserYearFinalVote(userId, privateUserYearFinalVote);
    navigate(`/private/users/${userId}`);
  };

  useEffect(() => {
    setInterval(() => {
      setNow(new Date());
    }, 1000);
  }, [setNow]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">
          Create Final Vote of the NEMTUS Hackathon {yearId}.
        </h2>
        <div className="card-content flex flex-col justify-start">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between">
                  <h3 className="card-title justify-start">Entry List</h3>
                  <h3 className="card-title justify-end">
                    <a
                      className="link link-primary"
                      href={`/years/${yearId}/results`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View All Details
                    </a>
                  </h3>
                </div>
                <div className="card-content flex flex-col justify-start">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                          <div
                            className="tooltip"
                            data-tip={
                              props.publicResults[index].submission.description
                            }
                          >
                            <h4 className="card-title justify-start">
                              <a
                                className="link link-primary"
                                href={
                                  '/years/' +
                                  props.publicResults[index].yearId +
                                  '/results/' +
                                  props.publicResults[index].submissionId
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Entry No. {index + 1} Team:{' '}
                                {props.publicResults[index].team.name} Work:{' '}
                                {props.publicResults[index].submission.name}
                              </a>
                            </h4>
                          </div>
                          <div className="card-content flex flex-col justify-start">
                            <div className="flex items-center">
                              <button
                                className="btn btn-error inline-flex m-1"
                                onClick={() => handleIncrementPoint(index, -10)}
                                type="button"
                              >
                                <FaMinus />
                                10
                              </button>
                              <button
                                className="btn btn-error inline-flex m-1"
                                onClick={() => handleIncrementPoint(index, -1)}
                                type="button"
                              >
                                <FaMinus />1
                              </button>
                              <div className="form-control w-full max-w-xs m-1">
                                <label className="label">
                                  <span className="label-text">Point</span>
                                  <span className="label-text-alt">
                                    Required
                                  </span>
                                </label>
                                <input
                                  type="number"
                                  placeholder="Example: 0"
                                  className="input input-bordered w-full max-w-xs"
                                  {...register(`votes.${index}.point`)}
                                />
                                <label className="label">
                                  <span className="label-text-alt text-error">
                                    {(() => {
                                      if (!errors.votes) {
                                        return;
                                      }
                                      if (!errors.votes.length) {
                                        return;
                                      }
                                      if (errors.votes.length <= index) {
                                        return;
                                      }
                                      const fieldErrors = errors.votes[index]
                                        ?.point as FieldError | undefined;
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
                              <button
                                className="btn btn-success inline-flex m-1"
                                onClick={() => handleIncrementPoint(index, 1)}
                                type="button"
                              >
                                <FaPlus />1
                              </button>
                              <button
                                className="btn btn-success inline-flex m-1"
                                onClick={() => handleIncrementPoint(index, 10)}
                                type="button"
                              >
                                <FaPlus />
                                10
                              </button>
                            </div>
                            <div className="form-control w-full">
                              <label className="label">
                                <span className="label-text">Message</span>
                                <span className="label-text-alt">
                                  Optional(Max: 140)
                                </span>
                              </label>
                              <textarea
                                placeholder="Example: Great works! I love it!"
                                className="textarea textarea-bordered w-full"
                                {...register(`votes.${index}.message`)}
                              />
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {(() => {
                                    if (!errors.votes) {
                                      return;
                                    }
                                    if (!errors.votes.length) {
                                      return;
                                    }
                                    if (errors.votes.length <= index) {
                                      return;
                                    }
                                    const fieldErrors = errors.votes[index]
                                      ?.message as FieldError | undefined;
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
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full max-w-xs" type="submit">
              Create Final Vote
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserFinalYearVoteCreateFormWidgetComponent;
