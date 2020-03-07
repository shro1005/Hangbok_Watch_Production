package com.hangbokwatch.backend.controller;

import org.junit.Test;
import org.springframework.mock.env.MockEnvironment;
import static org.assertj.core.api.Assertions.assertThat;

public class ProfileControllerUnitTest {

    @Test
    public void production_profile이_조회된다() {
        //given
        String expectProfile = "production";
        MockEnvironment env = new MockEnvironment();
        env.addActiveProfile(expectProfile);
        env.addActiveProfile("pro1");
        env.addActiveProfile("pro2");

        ProfileController controller =  new ProfileController(env);

        //when
        String profile = controller.profile();

        //then
        assertThat(profile).isEqualTo(expectProfile);
    }

    @Test
    public void production_profile이_없으면_pro1이_조회된다() {
        //given
        String expectProfile = "pro1";
        MockEnvironment env = new MockEnvironment();
        env.addActiveProfile(expectProfile);
        env.addActiveProfile("pro2");

        ProfileController controller =  new ProfileController(env);

        //when
        String profile = controller.profile();

        //then
        assertThat(profile).isEqualTo(expectProfile);
    }

    @Test
    public void production_profile이_없으면_default가_조회된다() {
        //given
        String expectProfile = "default";
        MockEnvironment env = new MockEnvironment();
        ProfileController controller =  new ProfileController(env);

        //when
        String profile = controller.profile();

        //then
        assertThat(profile).isEqualTo(expectProfile);
    }
}
