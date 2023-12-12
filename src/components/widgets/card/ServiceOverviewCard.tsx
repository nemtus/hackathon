import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import XymCityCityscapeImage from '../../../images/xym-city-cityscape-light.png';

const CURRENT_YEAR = process.env.REACT_APP_CURRENT_YEAR;
if (!CURRENT_YEAR) {
  throw Error('REACT_APP_CURRENT_YEAR is not defined');
}

const ServiceOverviewCardWidgetComponent = () => {
  return (
    <div className="card bg-base-100">
      <figure>
        <img
          className="max-w-md h-auto"
          src={XymCityCityscapeImage}
          alt="XYM City Cityscape Image"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title justify-center text-3xl font-bold">
          Our Hackathon Memories Forever...
        </h2>
        <p className="card-content flex justify-center">
          {"Let's record our hackathon on the blockchain forever!"}
        </p>
        <div className="card-actions justify-center">
          <a
            className="btn btn-link"
            href={`https://hackathon-${CURRENT_YEAR}.nemtus.com/`}
          >
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            Details ({CURRENT_YEAR})
          </a>
          {/* <a className="btn btn-link" href={`/years/${CURRENT_YEAR}/results`}>
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            Entry List ({CURRENT_YEAR})
          </a> */}
          {/* <a className="btn btn-link" href={`/years/${CURRENT_YEAR}/awards`}>
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            Award List ({CURRENT_YEAR})
          </a> */}
          <a className="btn btn-link" href="https://hackathon.nemtus.com">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            History
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceOverviewCardWidgetComponent;
