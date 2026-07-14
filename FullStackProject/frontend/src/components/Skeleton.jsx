const Skeleton = ({ type = "box", count = 1, style = {} }) => {
  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <div 
          key={i} 
          className={`skeleton skeleton-${type}`} 
          style={style}
        ></div>
      );
    }
    return skeletons;
  };

  return <>{renderSkeletons()}</>;
};

export default Skeleton;
