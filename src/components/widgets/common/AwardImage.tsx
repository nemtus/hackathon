import { Award } from 'models/configs/hackathon/years/award';

const AwardImageComponent = (props: { award: Award }) => {
  if (!props.award.message) {
    return (
      <div className="btn btn-square btn-ghost w-48 h-60">
        <img className="w-full" src={props.award.imageUrl} alt="Award Image" />
      </div>
    );
  }

  return (
    <div className="w-48">
      <label
        className="btn btn-square btn-ghost w-48 h-60"
        htmlFor={`award-message-modal-${props.award.id}`}
      >
        <img className="w-full" src={props.award.imageUrl} alt="Award Image" />
      </label>

      <input
        type="checkbox"
        id={`award-message-modal-${props.award.id}`}
        className="modal-toggle"
      />
      <label
        htmlFor={`award-message-modal-${props.award.id}`}
        className="modal cursor-pointer"
      >
        <label htmlFor="" className="modal-box relative">
          <h3 className="text-lg font-bold">Award Message</h3>
          <p className="py-4">{props.award.message}</p>
        </label>
      </label>
    </div>
  );
};

export default AwardImageComponent;
