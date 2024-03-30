import {
  Award,
  ConfigHackathonYearAward,
  getConfigHackathonYearAward,
} from 'models/configs/hackathon/years/award';
import { PublicUser } from 'models/public/users';
import { getAllPublicJudges, PublicJudge } from '../judges';
import { getAllPublicFinalJudges, PublicFinalJudge } from '../final-judges';
import {
  getAllPublicSubmissions,
  getPublicSubmission,
  PublicSubmission,
} from '../submissions';
import { getAllPublicTeams, getPublicTeam, PublicTeam } from '../teams';
import { getAllPublicVotes, PublicVote } from '../votes';
import { getAllPublicFinalVotes, PublicFinalVote } from '../final-votes';

export type PublicResult = {
  yearId: string;
  teamId: string;
  team: PublicTeam;
  submissionId: string;
  submission: PublicSubmission;
  judges: PublicJudge[];
  votes: PublicVote[];
  finalJudges: PublicFinalJudge[];
  finalVotes: PublicFinalVote[];
  awards: Award[];
  judgeUsers: PublicUser[];
  judgesTotalPoints: number;
  votesTotalPoints: number;
  finalJudgesTotalPoints: number;
  finalVotesTotalPoints: number;
  totalPoints: number;
};

export type PublicResults = PublicResult[];

export const getPublicResult = async (
  yearId: string,
  teamId: string,
  submissionId: string
): Promise<PublicResult | undefined> => {
  const [
    publicTeam,
    publicSubmission,
    publicJudges,
    publicVotes,
    publicFinalJudges,
    publicFinalVotes,
    configHackathonYearAward,
  ] = await Promise.all([
    getPublicTeam(yearId, teamId),
    getPublicSubmission(yearId, submissionId),
    getAllPublicJudges(yearId),
    getAllPublicVotes(yearId),
    getAllPublicFinalJudges(yearId),
    getAllPublicFinalVotes(yearId),
    getConfigHackathonYearAward(yearId),
  ]);
  console.log({
    publicTeam,
    publicSubmission,
    publicJudges,
    publicVotes,
    publicFinalJudges,
    publicFinalVotes,
    configHackathonYearAward,
  });
  if (!publicTeam || !publicSubmission || !configHackathonYearAward) {
    return undefined;
  }
  return createPublicResultData(
    yearId,
    teamId,
    submissionId,
    publicTeam,
    publicSubmission,
    publicJudges,
    publicVotes,
    publicFinalJudges,
    publicFinalVotes,
    configHackathonYearAward
  );
};

const createPublicResultData = (
  yearId: string,
  teamId: string,
  submissionId: string,
  publicTeam: PublicTeam,
  publicSubmission: PublicSubmission,
  publicJudges: PublicJudge[],
  publicVotes: PublicVote[],
  publicFinalJudges: PublicFinalJudge[],
  publicFinalVotes: PublicFinalVote[],
  configHackathonYearAward: ConfigHackathonYearAward
): PublicResult => {
  const judges = publicJudges
    .map((publicJudge) => {
      return publicJudge.judges.find(
        (judge) =>
          judge.yearId === yearId &&
          judge.teamId === teamId &&
          judge.submissionId === submissionId
      );
    })
    .filter((judge) => judge !== undefined)
    .map((judge) => judge?.point ?? 0);
  const judgesTotalPoints = judges.length
    ? judges.reduce((acc, cur) => acc + cur)
    : 0;

  const votes = publicVotes
    .map((publicVote) => {
      return publicVote.votes.find(
        (vote) =>
          vote.yearId === yearId &&
          vote.teamId === teamId &&
          vote.submissionId === submissionId
      );
    })
    .filter((vote) => vote !== undefined)
    .map((vote) => vote?.point ?? 0);
  const votesTotalPoints = votes.length
    ? votes.reduce((acc, cur) => acc + cur)
    : 0;

  const finalJudges = publicFinalJudges
    .map((publicFinalJudge) => {
      return publicFinalJudge.judges.find(
        (judge) =>
          judge.yearId === yearId &&
          judge.teamId === teamId &&
          judge.submissionId === submissionId
      );
    })
    .filter((judge) => judge !== undefined)
    .map((judge) => judge?.point ?? 0);
  const finalJudgesTotalPoints = finalJudges.length
    ? finalJudges.reduce((acc, cur) => acc + cur)
    : 0;

  const finalVotes = publicFinalVotes
    .map((publicFinalVote) => {
      return publicFinalVote.votes.find(
        (vote) =>
          vote.yearId === yearId &&
          vote.teamId === teamId &&
          vote.submissionId === submissionId
      );
    })
    .filter((vote) => vote !== undefined)
    .map((vote) => vote?.point ?? 0);
  const finalVotesTotalPoints = finalVotes.length
    ? finalVotes.reduce((acc, cur) => acc + cur)
    : 0;

  const totalPoints =
    judgesTotalPoints +
      votesTotalPoints +
      finalJudgesTotalPoints +
      finalVotesTotalPoints ?? 0;

  const awards = configHackathonYearAward.awards.filter((award) => {
    return award.submissionId === publicSubmission.id;
  });

  const judgeUsers = configHackathonYearAward.judgeUsers;

  return {
    yearId,
    teamId,
    team: publicTeam,
    submissionId,
    submission: publicSubmission,
    judges: publicJudges,
    votes: publicVotes,
    finalJudges: publicFinalJudges,
    finalVotes: publicFinalVotes,
    awards,
    judgeUsers,
    judgesTotalPoints,
    votesTotalPoints,
    finalJudgesTotalPoints,
    finalVotesTotalPoints,
    totalPoints,
  };
};

// Note: Submission createdAt asc order
export const getAllPublicResults = async (
  yearId: string,
  order: 'createdTimeAsc' | 'totalPointsDesc'
): Promise<PublicResults> => {
  const [
    publicTeams,
    publicSubmissions,
    publicJudges,
    publicVotes,
    publicFinalJudges,
    publicFinalVotes,
    configHackathonYearAward,
  ] = await Promise.all([
    getAllPublicTeams(yearId),
    getAllPublicSubmissions(yearId),
    getAllPublicJudges(yearId),
    getAllPublicVotes(yearId),
    getAllPublicFinalJudges(yearId),
    getAllPublicFinalVotes(yearId),
    getConfigHackathonYearAward(yearId),
  ]);

  const publicResults = publicSubmissions
    .map((publicSubmission) => {
      const publicTeam = publicTeams.find(
        (publicTeam) => publicTeam.id === publicSubmission.teamId
      );
      if (!publicTeam || !configHackathonYearAward) {
        return undefined;
      }
      return createPublicResultData(
        yearId,
        publicTeam.id,
        publicSubmission.id,
        publicTeam,
        publicSubmission,
        publicJudges,
        publicVotes,
        publicFinalJudges,
        publicFinalVotes,
        configHackathonYearAward
      );
    })
    .filter((publicResult) => publicResult) as PublicResults;
  if (order === 'createdTimeAsc') {
    return sortPublicResultsWithCreatedTime(publicResults, 'asc');
  }
  if (order === 'totalPointsDesc') {
    return sortPublicResultsWithTotalPoints(publicResults, 'desc');
  }
  return sortPublicResultsWithCreatedTime(publicResults, 'asc');
};

const sortPublicResultsWithCreatedTime = (
  publicResults: PublicResults,
  ascOrDesc: 'asc' | 'desc' = 'asc'
) => {
  return publicResults.sort((a, b) => {
    if (!a || !b) {
      return 0;
    }
    if (!a.submission.createdAt || !b.submission.createdAt) {
      return 0;
    }
    if (ascOrDesc === 'asc') {
      if (a.submission.createdAt < b.submission.createdAt) {
        return -1;
      }
      if (a.submission.createdAt > b.submission.createdAt) {
        return 1;
      }
      return 0;
    }
    if (ascOrDesc === 'desc') {
      if (a.submission.createdAt > b.submission.createdAt) {
        return -1;
      }
      if (a.submission.createdAt < b.submission.createdAt) {
        return 1;
      }
      return 0;
    }
    return 0;
  });
};

const sortPublicResultsWithTotalPoints = (
  publicResults: PublicResults,
  ascOrDesc: 'asc' | 'desc' = 'desc'
) => {
  return publicResults.sort((a, b) => {
    if (!a || !b) {
      return 0;
    }
    if (ascOrDesc === 'asc') {
      if (a.totalPoints < b.totalPoints) {
        return -1;
      }
      if (a.totalPoints > b.totalPoints) {
        return 1;
      }
      return 0;
    }
    if (ascOrDesc === 'desc') {
      if (a.totalPoints > b.totalPoints) {
        return -1;
      }
      if (a.totalPoints < b.totalPoints) {
        return 1;
      }
      return 0;
    }
    return 0;
  });
};
