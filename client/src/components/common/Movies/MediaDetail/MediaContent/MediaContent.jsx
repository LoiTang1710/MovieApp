import ContentLeft from './ContentRight/ContentRight'
import ContentRight from './ContentLeft/ContentLeft'

const MediaContent = () => {
  return (
    <div className="relative flex justify-between p-10 -mt-82 z-10">
      {/* Right */}
      <ContentRight />

      {/* Left */}
      <ContentLeft />
    </div>
  )
}

export default MediaContent
