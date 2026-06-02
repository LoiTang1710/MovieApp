import { Send } from 'lucide-react'

const SendButton = () => {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <button
        type="button"
        className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110"
      >
        <Send
          size={20}
          className="text-white group-hover:text-blue-400 transition-colors"
        />
      </button>
      <p className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
        Chia sẻ
      </p>
    </div>
  )
}

export default SendButton
