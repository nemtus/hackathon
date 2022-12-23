import SymbolFlagImage from '../../../images/symbol-flag-light.png';

const LetsEntryCardWidgetComponent = () => {
  return (
    <div className="card bg-base-100">
      <figure>
        <img
          className="max-w-md h-auto"
          src={SymbolFlagImage}
          alt="Symbol Flag Image"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title justify-center text-5xl font-bold">
          {"Let's Entry"}
        </h2>
        <p className="card-content flex justify-center">
          {
            "If you wanna participate in the hackathon and submit your work, Let's sign in and entry!"
          }
        </p>
        <p className="card-content flex justify-center">
          {"If you wanna only vote or judge, Let's sign in and do not entry."}
        </p>
        <p className="card-content flex justify-center">
          {
            "Once you entry, Let's enjoy the hackathon to submit your wonderful work!"
          }
        </p>
        <p className="card-content flex justify-center text-2xl font-bold">
          {'Good luck!'}
        </p>
      </div>
    </div>
  );
};

export default LetsEntryCardWidgetComponent;
