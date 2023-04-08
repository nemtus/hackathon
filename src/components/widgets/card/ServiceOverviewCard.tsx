import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import XymCityCityscapeImage from '../../../images/xym-city-cityscape-light.png';

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
          <a className="btn btn-link" href="https://hackathon-2023.nemtus.com/">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            Details (2023)
          </a>
          <a className="btn btn-link" href="/years/2023/results">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            Entry List (2023)
          </a>
          <a className="btn btn-link" href="/years/2023/awards">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            Award List (2023)
          </a>
          <a className="btn btn-link" href="https://hackathon-2022.nemtus.com/">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            {'History (2022)'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceOverviewCardWidgetComponent;
