import { Award } from 'models/configs/hackathon/years/award';
import ordinal from 'ordinal';
import AwardImage from '../../../images/award-image.png';

const AwardImageComponent = (props: { award: Award }) => {
  return (
    <div
      className="tooltip tooltip-bottom w-48 z-50"
      data-tip={props.award.message}
    >
      <a
        className="relative"
        href={props.award.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="w-full" src={AwardImage} alt="Award Image" />
        <div className="absolute left-0 top-1/2 -translate-x-2/4 -translate-y-14">
          <div className="flex flex-col justify-center">
            <div>
              {props.award.type === 'Award'
                ? `${ordinal(props.award.index)} Prize`
                : props.award.name}
            </div>
            <div>{props.award.award}</div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default AwardImageComponent;
