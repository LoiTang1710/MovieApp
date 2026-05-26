

const Overview = ({overview}) => {
  return (
    <div className="w-100 detail-vertical">
      <span className="info-title">Mô tả</span>
      <p className="info-detail">
        {overview || 'Chưa có tóm tắt nội dung cho bộ phim này.'}
      </p>
    </div>
  )
}

export default Overview
