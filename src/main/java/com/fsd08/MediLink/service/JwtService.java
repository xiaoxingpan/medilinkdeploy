package com.fsd08.MediLink.service;

import com.fsd08.MediLink.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecureDigestAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

import static io.jsonwebtoken.Jwts.*;
import static io.jsonwebtoken.Jwts.SIG;
import static io.jsonwebtoken.Jwts.builder;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final UserRepository userRepository;
   public static final int ACCESS_EXPIRE = 6000000;
    //algorithm for encryption
    private final static SecureDigestAlgorithm<SecretKey, SecretKey> ALGORITHM = SIG.HS256;
    //secrete
    private final static String SECRET = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsRnE83rm6BJya";
   //secret key
    //public static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    public static final SecretKey KEY = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET));

    //jwt issuer
    private final static String JWT_ISS = "MEDILINK";
//jwt subject
    private final static String SUBJECT = "JWT";
    public String getGeneratedToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return generateTokenForUser(claims, username);
    }

    public String generateTokenForUser(Map<String, Object> claims, String username) {
        String uuid = UUID.randomUUID().toString();
        Date exprireDate = Date.from(Instant.now().plusSeconds(ACCESS_EXPIRE));

        return builder()
                // 设置头部信息header
                .header()
                .add("typ", "JWT")
                .add("alg", "HS256")
                .and()
                // 设置自定义负载信息payload
                .claim("username",username)

                // 令牌ID
                .id(uuid)
                // 过期日期
                .expiration(exprireDate)
                // 签发时间
                .issuedAt(new Date())
                // 主题
                .subject(username)
                // 签发者
                .issuer(JWT_ISS)
                // 签名
                .signWith(KEY, ALGORITHM)
                .compact();
    }

    public boolean isTokenExpired(String theToken){
        return extractExpirationTimeFromToken(theToken).before(new Date());

    }
    //@SuppressWarnings("deprecation")
    public Date extractExpirationTimeFromToken(String token) {

        return parseClaim(token).getPayload().getExpiration();

    }

    public static Jws<Claims> parseClaim(String token) {
        return parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims= extractAllClaims(token);
        return claimsResolver.apply(claims);

    }
    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(KEY)
               .build()
                .parseSignedClaims(token)
                .getPayload();

    }

    public String extractUsernameFromToken(String theToken){
        //return extractClaim(theToken,Claims::getSubject);
        return parseClaim(theToken).getPayload().getSubject();
    }

    public Boolean validateToken(String theToken, UserDetails userDetails){
        final String username = extractUsernameFromToken(theToken);
        return(username.equals(userDetails.getUsername())&& !isTokenExpired(theToken));
    }
}
