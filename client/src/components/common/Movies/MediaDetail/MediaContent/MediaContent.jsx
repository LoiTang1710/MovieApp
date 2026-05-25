import ContentRight from './ContentRight/ContentRight'
import ContentLeft from './ContentLeft/ContentLeft'

const MediaContent = () => {
  return (
    <div className="relative flex justify-between p-10 -mt-82 z-10">
      {/* Left */}
      <ContentLeft />
      {/* Right */}
      <ContentRight />

    </div>
  )
}

export default MediaContent
