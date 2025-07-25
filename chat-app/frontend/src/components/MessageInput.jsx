import { useState, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Image, X, Send } from 'lucide-react';

function MessageInput() {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImagePreview(base64Image);
      }
      reader.readAsDataURL(file);
    }
  }

  const removeImage = () => {
    setImagePreview(null);
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      const messageData = { message: text, image: imagePreview };
      await sendMessage(messageData);
      setText('');
      setImagePreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  return (
    <div className='p-4 w-full'>
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* form */}
      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <input type='text'
            className='w-full input input-bordered rounded-lg input-sm sm:input-md'
            placeholder='Type a message...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* image upload field, hidden from user */}
          <input type="file"
            ref={fileInputRef}
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
          />
          {/* image upload button */}
          <button type='button'
            className={` hidden sm:flex btn btn-circle
              ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
            onClick={() => fileInputRef.current.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button type='submit'
          className='btn btn-sm btn-circle'
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>

      </form>
    </div>
  )
}

export default MessageInput;