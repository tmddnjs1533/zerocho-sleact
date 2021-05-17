import React, { useCallback, useState } from 'react';
import { Button, Form, Header, Input, Label, LinkContainer, Error } from '@pages/SignUp/styles';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);
  /*, {
    dedupingInterval: 100000, // default : 2000
  });*/
  // https://github.com/vercel/swr
  /*
    dedupingInterval = 2000: dedupe requests with the same key in this time span
    focusThrottleInterval = 5000: only revalidate once during a time span
    loadingTimeout = 3000: timeout to trigger the onLoadingSlow event
    errorRetryInterval = 5000: error retry interval (details)
    errorRetryCount: max error retry count (details)
    onLoadingSlow(key, config): callback function when a request takes too long to load (see loadingTimeout)
    api 통신할 때 원래 일일히 만들어줘야됨,(deduping, 쓰로틀링, 에러리트라이, 로딩슬로우...)
     */
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          revalidate(); // 주기적으로 swr 호출, dedupingInterval 기간 내에는 캐시에서 불러옴
          // mutate(response.data, false); // 요청의 data가있으면 요청 안보냄
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
