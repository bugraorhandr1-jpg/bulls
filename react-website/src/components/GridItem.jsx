import PropTypes from 'prop-types';
import Icon from './Icon';

function GridItem({ title, description, icon }) {
  return (
    <div className="grid-item">
      <div className="grid-icon">
        <Icon name={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

GridItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default GridItem;
