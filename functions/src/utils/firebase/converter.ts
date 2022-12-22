import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export const converter = <
  T extends Record<string, unknown>
>(): FirestoreDataConverter<T> => {
  return {
    toFirestore: (data: T) => {
      // Note: プロパティの最上位階層のみに対して変換を行う実装としている
      // Note: ネストさせたプロパティについては変換を行わないので注意が必要
      const cloneObj = Object.assign(data);
      Object.keys(cloneObj).forEach((key) => {
        // Note: undefinedなプロパティが含まれているとエラーになるので取り除く
        if (cloneObj[key] === undefined) {
          delete cloneObj[key];
        }
      });
      // Note: 自動的にupdatedAtを現在時刻で更新する
      cloneObj['updatedAt'] = new Date();
      return cloneObj;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>) => {
      // Note: プロパティの最上位階層のみに対して変換を行う実装としている
      // Note: ネストさせたプロパティについては変換を行わないので注意が必要
      const data = snapshot.data();
      const cloneObj = Object.assign(data);
      Object.keys(cloneObj).forEach((key) => {
        // Note: ServerTimestamp型のプロパティをDate型に変換する
        // Note: ServerTimestamp型の判定は、toString, toDateメソッドが存在するかで行う
        if (
          typeof cloneObj[key].toString === 'function' &&
          typeof cloneObj[key].toDate === 'function'
        ) {
          cloneObj[key] = cloneObj[key].toDate();
        }
      });
      return cloneObj;
    },
  };
};
