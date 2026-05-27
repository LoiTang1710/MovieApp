import ActionButton from '../../../../ActionButton/ActionButton'
import Casts from '../../../MediaInfo/Casts/Casts'
import Episodes from '../../../MediaInfo/Seasons/Episodes/Episodes'
import Seasons from '../../../MediaInfo/Seasons/Seasons'
import CommunitySection from '../../../../Reviews/CommunitySection'

const ContentRight = () => {
  return (
    <div className="w-full ml-2 p-10 bg-linear-to-b from-black/40 to-black/40 rounded-tl-4xl rounded-bl-4xl rounded-tr-lg rounded-br-lg ">
      <ActionButton />
      <Seasons />
      <Episodes />
      <Casts />
      <CommunitySection />
    </div>
  )
}

export default ContentRight
