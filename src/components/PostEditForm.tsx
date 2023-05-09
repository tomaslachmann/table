import { Post, ButtonVariant } from '../types';
import FormInput from './FormInput';
import Button from './Button';
import Textarea from './Textarea';

type PostEditFormProps = {
  currentPost?: Post;
  setCurrentPost: (post: Post) => void;
  onSubmit: (post: Post) => void;
  onCancel: () => void;
};

export default function PostEditForm({ currentPost, setCurrentPost, onSubmit, onCancel }: PostEditFormProps){

  function handleTitleChange(val: string){
    handleChange(val, 'title');
  }

  function handleBodyChange(val: string){
    handleChange(val, 'body');
  }

  function handleChange(val: string, type: keyof Post){
    if(currentPost){
      const newPost: Post = { ...currentPost, [type]: val };
      setCurrentPost(newPost);
    }
  }

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(currentPost){
      onSubmit(currentPost);
    }
  }

  return(
    <>
      <div>
        <h1 className="text-xl text-center font-semibold dark:text-gray-300">Edit form</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:px-20 w-full items-center">
        <FormInput<string> label='title' id='title' type='text' onChange={handleTitleChange} value={currentPost?.title ?? ''} placeHolder='title' required />
        <Textarea id='body' value={currentPost?.body} onChange={handleBodyChange} label='body' required />
        <div className="p-6 text-center">
          <Button type={ButtonVariant.success}>Save</Button>
          <Button onClick={onCancel} type={ButtonVariant.normal}>Cancel</Button>
        </div>
      </form>
    </>
  );
}