import { getAllPublicJudges, PublicJudge } from '../judges';
import {
  getAllPublicSubmissions,
  getPublicSubmission,
  PublicSubmission,
} from '../submissions';
import { getAllPublicTeams, getPublicTeam, PublicTeam } from '../teams';
import { getAllPublicVotes, PublicVote } from '../votes';

export type PublicResult = {
  yearId: string;
  teamId: string;
  team: PublicTeam;
  submissionId: string;
  submission: PublicSubmission;
  judges: PublicJudge[];
  votes: PublicVote[];
  judgesTotalPoints: number;
  votesTotalPoints: number;
  totalPoints: number;
};

export type PublicResults = PublicResult[];

export const getPublicResult = async (
  yearId: string,
  teamId: string,
  submissionId: string
): Promise<PublicResult | undefined> => {
  const [publicTeam, publicSubmission, publicJudges, publicVotes] =
    await Promise.all([
      getPublicTeam(yearId, teamId),
      getPublicSubmission(yearId, submissionId),
      getAllPublicJudges(yearId),
      getAllPublicVotes(yearId),
    ]);
  if (!publicTeam || !publicSubmission) {
    return undefined;
  }
  return createPublicResultData(
    yearId,
    teamId,
    submissionId,
    publicTeam,
    publicSubmission,
    publicJudges,
    publicVotes
  );
};

const createPublicResultData = (
  yearId: string,
  teamId: string,
  submissionId: string,
  publicTeam: PublicTeam,
  publicSubmission: PublicSubmission,
  publicJudges: PublicJudge[],
  publicVotes: PublicVote[]
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

  const totalPoints = judgesTotalPoints + votesTotalPoints ?? 0;

  return {
    yearId,
    teamId,
    team: publicTeam,
    submissionId,
    submission: publicSubmission,
    judges: publicJudges,
    votes: publicVotes,
    judgesTotalPoints,
    votesTotalPoints,
    totalPoints,
  };
};

// Note: Submission createdAt asc order
export const getAllPublicResults = async (
  yearId: string,
  order: 'createdTimeAsc' | 'totalPointsDesc'
): Promise<PublicResults> => {
  const [publicTeams, publicSubmissions, publicJudges, publicVotes] =
    await Promise.all([
      getAllPublicTeams(yearId),
      getAllPublicSubmissions(yearId),
      getAllPublicJudges(yearId),
      getAllPublicVotes(yearId),
    ]);

  const publicResults = publicSubmissions
    .map((publicSubmission) => {
      const publicTeam = publicTeams.find(
        (publicTeam) => publicTeam.id === publicSubmission.teamId
      );
      if (!publicTeam) {
        return undefined;
      }
      return createPublicResultData(
        yearId,
        publicTeam.id,
        publicSubmission.id,
        publicTeam,
        publicSubmission,
        publicJudges,
        publicVotes
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
