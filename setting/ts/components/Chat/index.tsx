import React, { VFC, memo, useMemo } from 'react';
import { ChatWrapper } from '@components/Chat/style';
import { IChat, IDM } from '@typings/db';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface Props {
  data: IDM | IChat;
}
// const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird,com';
const BACK_URL = 'http://localhost:3095';
const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const user = 'Sender' in data ? data.Sender : data.User;
  // \d 숫자   +는 한개 이상 ?는 0개나 1개, *가 0개 이상 g는 모두 찾기
  // () 소괄호는 그룹핑하여 arr[0], arr[1] ... 에 할당됨
  const result = useMemo(
    () =>
      // uploads\\ 서버주소
      data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} alt={data.content} />
      ) : (
        regexifyString({
          input: data.content,
          pattern: /@\[(.+?)\]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr: string[] | null = match.match(/@\[(.+?)\]\((\d+?)\)/)!;
            if (arr) {
              return (
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`} className="chat-mention">
                  @{arr[1]}
                </Link>
              );
            }
            return <br key={index} />; // 줄바꿈까지
          },
        })
      ),
    [workspace, data.content],
  );
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
