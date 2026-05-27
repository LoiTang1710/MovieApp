import ActionButton from '../../../../ActionButton/ActionButton'
import Casts from '../../../Casts/Casts'
import Episodes from '../../../Seasons/Episodes/Episodes'
import Seasons from '../../../Seasons/Seasons'

const ContentRight = () => {
  return (
    <div className="w-full ml-2 p-10 bg-linear-to-b from-black/40 to-black/40 rounded-tl-4xl rounded-bl-4xl rounded-tr-lg rounded-br-lg ">
      {/* Button Action */}
      <ActionButton/>
      {/* Episode List */}
      <Seasons />
      {/* Episodes */}
      <Episodes/>
      {/* Cast */}
      <Casts/>

      {/* Rate and Comment */}
      <div></div>
    </div>
  )
}

export default ContentRight
