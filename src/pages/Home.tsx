import { useState, useEffect } from 'react';
import DataTable, { ColumnProps } from '../components/DataTable';
import { FilterVariant, Post, UserRoleVariant } from '../types';
import { ApiClient } from '../client/httpCommon';
import Modal from '../components/Modal';
import Prompt, { PromptVariant } from '../components/Prompt';
import PostEditForm from '../components/PostEditForm';
import { useAuthenticationContext } from '../contexts';
import Spinner from '../components/Spinner';
import AccessDeniedError from '../errors/AccessDeniedError';

const MAX_CHARS_PER_COLUMN = 30;

const COLUMNS: ColumnProps<Post>[] = [
  {
    key: 'id',
    label: 'ID',
    isSortable: true,
    isFilterable: true,
    filter: FilterVariant.select,
    render: (post) => post.id,
  },
  {
    key: 'userId',
    label: 'User ID',
    isSortable: true,
    isFilterable: true,
    filter: FilterVariant.multiSelect,
    render: (post) => post.userId,
  },
  {
    key: 'title',
    label: 'Title',
    isSortable: true,
    isFilterable: true,
    filter: FilterVariant.input,
    render: (post) => `${post.title.slice(0, MAX_CHARS_PER_COLUMN)}${post.title.length > MAX_CHARS_PER_COLUMN ? '...' : ''}`,
  },
  {
    key: 'body',
    label: 'Body',
    isSortable: true,
    isFilterable: true,
    filter: FilterVariant.input,
    render: (post) => `${post.body.slice(0, MAX_CHARS_PER_COLUMN)}${post.body.length > MAX_CHARS_PER_COLUMN ? '...' : ''}`,
  },
];

const apiClient = new ApiClient();

export default function Home(){
  const { user } = useAuthenticationContext();
  const [ posts, setPosts ] = useState<Post[]>();
  const [ currentPost, setCurrentPost ] = useState<Post>();
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ deletePromptOpen, setDeletePromptOpen ] = useState(false);
  const [ editMode, setEditMode ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  function handleStartEdit(post: Post){
    setModalOpen(true);
    setEditMode(true);
    setCurrentPost(post);
  }

  function handleDelete(post: Post){
    setDeletePromptOpen(true);
    setCurrentPost(post);
  }

  function handleSubmit(post: Post){
    setLoading(true);
    post.userId = user!.uuid;
    if(post.id){
      if(user!.role === UserRoleVariant.reader){
        throw new AccessDeniedError();
      }
      apiClient.updatePost(post.id, post)
        .then(data => {
          const updatedPosts = posts!.map(p => {
            if(p.id === data.id){
              return data;
            }
            return p;
          });
          setPosts([ ...updatedPosts ]);
        })
        .then(() => {
          setLoading(false);
          setModalOpen(false);
        });
    }
    else{
      if(user!.role !== UserRoleVariant.admin){
        throw new AccessDeniedError();
      }
      apiClient.createPost(post)
        .then(data => {
          const newPosts = [ ...posts!, data ];
          setPosts(newPosts);
        })
        .then(() => {
          setLoading(false);
          setModalOpen(false);
        });
    }
  }

  function handleNewPostStart(){
    setEditMode(true);
    setCurrentPost({ title: '', id: NaN, body: '', userId: NaN });
    setModalOpen(true);
  }

  useEffect(() => {

    apiClient.getPosts()
      .then(posts => setPosts(posts));

  }, []);

  function handleDeleteSubmit(val: boolean){
    if(val && posts && currentPost){
      if(user!.role !== UserRoleVariant.admin){
        throw new AccessDeniedError();
      }
      apiClient.deletePost(currentPost.id)
        .then(() => setPosts([ ...posts.filter(post => post.id !== currentPost.id) ]))
        .then(() => setDeletePromptOpen(false));
    }
  }

  function handleShowDetail(post: Post){
    setEditMode(false);
    setCurrentPost(post);
    setModalOpen(true);
  }

  return(
    <section className="w-full flex flex-col items-center justify-center dark:bg-gray-900">
      {
        deletePromptOpen && <Prompt type={PromptVariant.warn} onClick={handleDeleteSubmit} isOpen={setDeletePromptOpen} text='Are you sure to delete this post?' />
      }
      {
        modalOpen &&
        <Modal setOpen={setModalOpen}>
          { editMode ? !loading ? <PostEditForm currentPost={currentPost} setCurrentPost={setCurrentPost} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} /> : <Spinner />
            :
            <>
              <h3 className="dark:text-gray-300">{currentPost?.title}</h3>
              <p className="dark:text-gray-300">{currentPost?.body}</p>
            </>
          }
        </Modal>}
      <div className="container lg:px-64 lg:py-20">
        {
          posts &&
          <DataTable<Post>
            columns={COLUMNS}
            items={posts}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
            onNew={handleNewPostStart}
            onRowClick={handleShowDetail}
            idExtractor={(post: Post) => post.id}
            filterKey='title'
            filterLabel='Search by Title'
            name='Post'
          />
        }
      </div>
    </section>
  );
}