// import { db } from '../../../../../utils/firebase';
// import { converter } from '../../../../../utils/firebase/converter';
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

// export const publicResultConverter = converter<PublicResult>();

export const getPublicResult = async (
  yearId: string,
  teamId: string,
  submissionId: string
): Promise<PublicResult | undefined> => {
  const publicTeam = await getPublicTeam(yearId, teamId);
  if (!publicTeam) {
    return undefined;
  }

  const publicSubmission = await getPublicSubmission(yearId, submissionId);
  if (!publicSubmission) {
    return undefined;
  }

  const publicJudges = await getAllPublicJudges(yearId);

  const publicVotes = await getAllPublicVotes(yearId);

  let judgesTotalPoints = 0;
  const judges = publicJudges
    .map((publicJudge) => {
      const judge = publicJudge.judges.find(
        (judge) =>
          judge.yearId === yearId &&
          judge.teamId === teamId &&
          judge.submissionId === submissionId
      );
      if (judge) {
        return judge;
      }
      return undefined;
    })
    .filter((judge) => judge !== undefined);
  judges.forEach((judge) => {
    if (judge) {
      judgesTotalPoints += judge.point;
    }
  });

  let votesTotalPoints = 0;
  const votes = publicVotes
    .map((publicVote) => {
      const vote = publicVote.votes.find(
        (vote) =>
          vote.yearId === yearId &&
          vote.teamId === teamId &&
          vote.submissionId === submissionId
      );
      if (vote) {
        return vote;
      }
      return undefined;
    })
    .filter((vote) => vote !== undefined);
  votes.forEach((vote) => {
    if (vote) {
      votesTotalPoints += vote.point;
    }
  });
  const totalPoints = judgesTotalPoints + votesTotalPoints;

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
  const publicTeams = await getAllPublicTeams(yearId);
  const publicSubmissions = await getAllPublicSubmissions(yearId);
  const publicResultsWithoutJudgesAndVotes = publicSubmissions
    .map((publicSubmission) => {
      const publicTeam = publicTeams.find(
        (publicTeam) => publicTeam.id === publicSubmission.teamId
      );
      if (!publicTeam) {
        return undefined;
      }
      return {
        yearId: publicSubmission.yearId,
        teamId: publicTeam.id,
        team: publicTeam,
        submissionId: publicSubmission.id,
        submission: publicSubmission,
      };
    })
    .filter(
      (publicResultWithoutJudgesAndVotes) =>
        publicResultWithoutJudgesAndVotes !== undefined
    );
  const publicResults: PublicResults = [];
  for (const publicResultWithoutJudgesAndVotes of publicResultsWithoutJudgesAndVotes) {
    if (!publicResultWithoutJudgesAndVotes) {
      continue;
    }
    const publicResult = await getPublicResult(
      publicResultWithoutJudgesAndVotes.yearId,
      publicResultWithoutJudgesAndVotes.teamId,
      publicResultWithoutJudgesAndVotes.submissionId
    );
    if (!publicResult) {
      continue;
    }
    publicResults.push(publicResult);
  }
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

// const collectionPath = (yearId: string) =>
//   `/v/1/scopes/public/years/${yearId}/votes`;
// const collectionRef = (yearId: string) =>
//   db
//     .collection(collectionPath(yearId))
//     .withConverter(converter<PublicResult>());
// const docPath = (yearId: string, id: string) =>
//   `${collectionPath(yearId)}/${id}`;
// const docRef = (yearId: string, id: string) =>
//   db.doc(docPath(yearId, id)).withConverter(converter<PublicResult>());

// export const getPublicVote = async (
//   yearId: string,
//   id: string
// ): Promise<PublicResult | undefined> => {
//   return (await docRef(yearId, id).get()).data();
// };

// export const setPublicVote = async (
//   publicTeam: PublicResult
// ): Promise<void> => {
//   await docRef(publicTeam.yearId, publicTeam.id).set(publicTeam, {
//     merge: true,
//   });
// };

// export const getAllPublicVotes = async (
//   yearId: string
// ): Promise<PublicResults> => {
//   return (await collectionRef(yearId).get()).docs.map((snapshot) =>
//     snapshot.data()
//   );
// };

// export const querySubmitPublicTeams = async (
//   yearId: string
// ): Promise<PublicTeams> => {
//   return (
//     await collectionRef(yearId)
//       .where('entryAt', '!=', null)
//       .where('submitAt', '!=', null)
//       .orderBy('entryAt', 'asc')
//       .get()
//   ).docs.map((snapshot) => snapshot.data());
// };

// export const queryVotePublicTeams = async (
//   yearId: string
// ): Promise<PublicTeams> => {
//   return (
//     await collectionRef(yearId)
//       .where('voteAt', '!=', null)
//       .orderBy('entryAt', 'asc')
//       .get()
//   ).docs.map((snapshot) => snapshot.data());
// };

// export const convertPublicUserYearVoteToPublicVote = (
//   userId: string,
//   publicUserYearVote: PublicUserYearVote
// ): PublicResult => {
//   const publicVote: PublicResult = publicUserYearVote;
//   return publicVote;
// };
