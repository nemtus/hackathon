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
import {
  PrivateUserYearFinalJudge,
  setPrivateUserYearFinalJudge,
} from 'models/private/users/years/final-judges';
import { useNavigate } from 'react-router-dom';
import { FinalJudge } from 'models/public/users/years/final-judges';
import { useEffect, useState } from 'react';
import { PublicResults } from 'models/public/years/results';
import { AuthUser } from 'utils/firebase';
import { PrivateUserYearEntry } from 'models/private/users/years/entries';
import { PrivateUserYearTeam } from 'models/private/users/years/teams';
import { PrivateUserYearSubmission } from 'models/private/users/years/submissions';
import { PrivateUserYearVote } from 'models/private/users/years/votes';
import { PrivateUserYearFinalVote } from 'models/private/users/years/final-votes';
import { ConfigHackathonYearEntry } from 'models/configs/hackathon/years/entry';
import { ConfigHackathonYearTeam } from 'models/configs/hackathon/years/team';
import { ConfigHackathonYearSubmission } from 'models/configs/hackathon/years/submission';
import { ConfigHackathonYearJudge } from 'models/configs/hackathon/years/judge';
import { ConfigHackathonYearVote } from 'models/configs/hackathon/years/vote';
import { ConfigHackathonYearFinalJudge } from 'models/configs/hackathon/years/final-judge';
import { ConfigHackathonYearFinalVote } from 'models/configs/hackathon/years/final-vote';

const CURRENT_YEAR = process.env.REACT_APP_CURRENT_YEAR;

const schema = yup.object().shape({
  id: yup.string(),
  userId: yup.string(),
  yearId: yup.string(),
  judges: yup.array(
    yup.object().shape({
      id: yup.string(),
      userId: yup.string(),
      yearId: yup.string(),
      teamId: yup.string(),
      submissionId: yup.string(),
      point: yup.number().required().integer().min(0).max(200),
      message: yup.string().required().max(140),
    })
  ),
});

const PrivateUserYearFinalJudgeCreateFormWidgetComponent = (props: {
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
      propsPrivateUserYearFinalJudge: props.privateUserYearFinalJudge,
      propsPrivateUserYearFinalVote: props.privateUserYearFinalVote,
      propsConfigHackathonYearJudgeStartAt:
        props.configHackathonYearJudge.startAt,
      now,
      propsConfigHackathonYearFinalJudgeEndAt:
        props.configHackathonYearFinalJudge.endAt,
      propsConfigHackathonYearFinalJudgeUsers:
        props.configHackathonYearFinalJudge.users,
      userIsJudge: props.configHackathonYearFinalJudge.users.some(
        (userId) =>
          userId === props.authUser.uid && userId === props.privateUser.id
      ),
    });
    console.log({
      propsAuthUserUid: props.authUser.uid === userId,
      propsYearId: props.yearId === CURRENT_YEAR,
      propsPrivateUserYearSubmission:
        props.privateUserYearSubmission === undefined,
      propsPrivateUserYearJudge: props.privateUserYearJudge !== undefined,
      propsPrivateUserYearVote: props.privateUserYearVote === undefined,
      propsPrivateUserYearFinalJudge:
        props.privateUserYearFinalJudge === undefined,
      propsPrivateUserYearFinalVote:
        props.privateUserYearFinalVote === undefined,
      propsConfigHackathonYearFinalJudgeStartAt:
        props.configHackathonYearFinalJudge.startAt <= now,
      now: now <= props.configHackathonYearFinalJudge.endAt,
      userIsJudge: props.configHackathonYearFinalJudge.users.some(
        (userId) =>
          userId === props.authUser.uid && userId === props.privateUser.id
      ),
    });
    return (
      props.authUser.uid === userId &&
      props.yearId === CURRENT_YEAR &&
      props.privateUserYearSubmission === undefined &&
      props.privateUserYearJudge !== undefined &&
      props.privateUserYearVote === undefined &&
      props.privateUserYearFinalJudge === undefined &&
      props.privateUserYearFinalVote === undefined &&
      props.configHackathonYearFinalJudge.startAt <= now &&
      now <= props.configHackathonYearFinalJudge.endAt &&
      props.configHackathonYearFinalJudge.users.some(
        (userId) =>
          userId === props.authUser.uid && userId === props.privateUser.id
      )
    );
  };

  const isCreatablePrivateUserYearFinalJudge = (
    privateUserYearFinalJudge: PrivateUserYearFinalJudge
  ) => {
    const isPositive = !privateUserYearFinalJudge.judges.some(
      (judge) => judge.point < 0 || !Number.isInteger(judge.point)
    );
    console.log({ isPositive });
    const isValidMessage = privateUserYearFinalJudge.judges.some((judge) => {
      console.log({ type: typeof judge.message, length: judge.message.length });
      return !(
        !(typeof judge.message === 'string') ||
        !judge.message.length ||
        judge.message.length > 140
      );
    });
    console.log({ isValidMessage });
    const judges = privateUserYearFinalJudge.judges.map((judge) =>
      parseInt(judge.point.toString())
    );
    const totalPoints = judges.length
      ? judges.reduce((acc, cur) => acc + cur)
      : 0;
    console.log({ totalPoints });
    console.log({ publicResultsLength: props.publicResults.length });
    const isValidTotalPoints = totalPoints === props.publicResults.length * 100;
    console.log({ isValidTotalPoints });
    return isPositive && isValidMessage && isValidTotalPoints;
  };

  const convertPublicResultsToInitialFinalJudges = (
    publicResults: PublicResults
  ) => {
    const finalJudges: FinalJudge[] = publicResults.map((publicResult) => {
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
    return finalJudges;
  };

  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PrivateUserYearFinalJudge>({
    mode: 'onChange',
    defaultValues: {
      id: userId,
      userId: userId,
      yearId: yearId,
      judges: convertPublicResultsToInitialFinalJudges(props.publicResults),
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
    name: 'judges',
  });

  const handleIncrementPoint = (index: number, increment: number) => {
    const currentPoint = getValues(`judges.${index}.point`);
    console.log({ currentPoint });
    const newPoint =
      parseInt(currentPoint.toString()) + parseInt(increment.toString());
    console.log({ newPoint });
    if (newPoint < 0) {
      alert('Point cannot be negative.');
      return;
    }
    setValue(`judges.${index}.point`, newPoint);

    const newJudges = getValues('judges');
    console.log({ newJudges });
    const judges = newJudges.map((judge) => parseInt(judge.point.toString()));
    const totalPoints = judges.length
      ? judges.reduce((acc, cur) => acc + cur)
      : 0;
    console.log({ totalPoints });
    if (totalPoints > newJudges.length * 100) {
      alert('Total points must be less than or equal to 5 x entry counts.');
      setValue(`judges.${index}.point`, currentPoint);
      const newJudges = getValues('judges');
      console.log({ newJudges });
      const judges = newJudges.map((judge) => parseInt(judge.point.toString()));
      const totalPoints = judges.length
        ? judges.reduce((acc, cur) => acc + cur)
        : 0;
      console.log({ totalPoints });
      return;
    }
  };

  const onSubmit: SubmitHandler<PrivateUserYearFinalJudge> = async (
    privateUserYearFinalJudge
  ): Promise<void> => {
    if (!isCreatableUser()) {
      alert(
        "You can't create a finalJudge. Because you are not a judge or the deadline has passed or you have already created a finalJudge."
      );
      return;
    }
    if (!isCreatablePrivateUserYearFinalJudge(privateUserYearFinalJudge)) {
      alert(
        "You can't create a finalJudge. Because the finalJudge is invalid. Please make sure that the number of points you have and the total number of points scored match. Please use up all the points you have."
      );
      return;
    }
    const now = new Date();
    privateUserYearFinalJudge.createdAt = now;
    privateUserYearFinalJudge.updatedAt = now;
    privateUserYearFinalJudge.approvedAt = undefined;
    const judges = getValues('judges').map((judge) =>
      parseInt(judge.point.toString())
    );
    privateUserYearFinalJudge.totalPoints = judges.length
      ? judges.reduce((acc, cur) => acc + cur)
      : 0;
    await setPrivateUserYearFinalJudge(userId, privateUserYearFinalJudge);
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
          Create Final Judge of the NEMTUS Hackathon {yearId}.
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
                                    Required(0-200)
                                  </span>
                                </label>
                                <input
                                  type="number"
                                  placeholder="Example: 0"
                                  className="input input-bordered w-full max-w-xs"
                                  {...register(`judges.${index}.point`)}
                                />
                                <label className="label">
                                  <span className="label-text-alt text-error">
                                    {(() => {
                                      if (!errors.judges) {
                                        return;
                                      }
                                      if (!errors.judges.length) {
                                        return;
                                      }
                                      if (errors.judges.length <= index) {
                                        return;
                                      }
                                      const fieldErrors = errors.judges[index]
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
                                  Required(Max: 140)
                                </span>
                              </label>
                              <textarea
                                placeholder="Example: Great works! I love it!"
                                className="textarea textarea-bordered w-full"
                                {...register(`judges.${index}.message`)}
                              />
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {(() => {
                                    if (!errors.judges) {
                                      return;
                                    }
                                    if (!errors.judges.length) {
                                      return;
                                    }
                                    if (errors.judges.length <= index) {
                                      return;
                                    }
                                    const fieldErrors = errors.judges[index]
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
              Create Final Judge
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserYearFinalJudgeCreateFormWidgetComponent;
