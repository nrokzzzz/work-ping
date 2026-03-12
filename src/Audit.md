# 2FA Audit — TwoFactorAuthentication & QrcodeAuthentication

---

## 🔴 Critical

### 1. `QrcodeAuthentication.jsx` — Runtime crash when `location.state` is null
**Line 18:** `const data = location.state` — if a user navigates to `/2fa-authnticator` directly (no state), `data` is `null`. Lines 57–60 and 162 access `data.action` and `data.path` which will crash.
```js
// Crashes with: TypeError: Cannot read properties of null (reading 'action')
if (data.action === "ORG")
  navigate(data.path)
```

### 2. `QrcodeAuthentication.jsx` — `console.log` in production (Lines 33, 49)
```js
console.log(error)    // Line 33
console.log(res)      // Line 49
```
Leaks sensitive 2FA responses to the browser dev console.

### 3. `QrcodeAuthentication.jsx` — Variable shadowing bug (Line 52)
Inside `handleVerify`, `res` is already declared on line 48. Line 52 redeclares `const res = await axiosClient.get('/verify-cookie')` — this shadows the outer `res` and can cause confusion.

### 4. `TwoFAContext.jsx` — `use2FA()` returns `undefined` outside provider
**Line 45:** `useContext(TwoFAContext)` returns `undefined` if called outside `<TwoFAProvider>`. No guard/throw.

---

## 🟠 Medium

### 5. `TwoFactorAuthentication.jsx` — `handleVerify` called from stale closure in useEffect
**Line 25–29:** `useEffect` calls `handleVerify()` when `code.length === 6`, but `handleVerify` is **not** in the dependency array. This creates a stale closure that captures old `code`, `loading`, and `error` values.
```js
useEffect(() => {
  if (code.length === 6) {
    handleVerify()  // stale closure — not in deps
  }
}, [code])
```

### 6. `QrcodeAuthentication.jsx` — Same stale closure issue (Lines 72–76)
Same pattern as #5 above — `handleVerify` not in deps of `useEffect`.

### 7. `QrcodeAuthentication.jsx` — No error toast on QR load failure
**Line 32–34:** `qrPage` catches errors but only does `console.log` and sets a status string. No toast notification to the user.

### 8. `QrcodeAuthentication.jsx` — No recovery from QR load failure
If the QR setup API fails, the user sees "Failed to load QR" text but has no guided way to retry except clicking "Refresh QR". Should show a clearer error with a visible retry button.

### 9. `TwoFactorAuthentication.jsx` — `executeAction` error not surfaced via toast
**Lines 56–63:** The caught `actionError` only updates the inline `error` state. Should also fire `toast.error()` for consistency with the rest of the app.

### 10. `QrcodeAuthentication.jsx` — No input `autoFocus` on code field
**Line 133:** Unlike `TwoFactorAuthentication.jsx` (which uses `autoFocus`), the QR page does not auto-focus the code input.

### 11. `QrcodeAuthentication.jsx` — No `onKeyDown` handler for Enter key
Unlike `TwoFactorAuthentication.jsx`, pressing Enter does not trigger verification.

### 12. `QrcodeAuthentication.jsx` — "Skip" button navigates without warning
**Line 160–164:** The "Skip" button does `navigate(data.path)` immediately, bypassing 2FA entirely. No confirmation dialog.

---

## 🟡 Low

### 13. `TwoFactorAuthentication.jsx` — Wrapped in `ComponentContainerCard` unnecessarily
**Line 102:** The modal overlay is wrapped in `<ComponentContainerCard>` which adds an extra card container around the full-screen overlay. The overlay should be a standalone portal or fragment.

### 14. `TwoFAContext.jsx` — `executeAction` sets `pendingAction(null)` even on failure
**Line 19:** If `pendingAction()` throws, the error is re-thrown, but `setPendingAction(null)` on line 19 is **not reached** (it's after the await, caught by try-catch). This is actually fine behavior-wise, but the intent should be clarified with a comment or by placing cleanup in `finally`.

### 15. `QrcodeAuthentication.jsx` — Missing `alt` attribute sizing on QR image
**Line 126:** `<img src={qrCode} alt="QR Code" />` has no explicit `width`/`height`, which can cause layout shifts.

### 16. `TwoFactorAuthentication.jsx` — Hardcoded z-index values (99999, 100000)
**Lines 107, 114:** Magic numbers should be centralized or use CSS variables.

### 17. `QrcodeAuthentication.jsx` — Same hardcoded z-index values (99999, 100000)
**Lines 91, 97:** Duplicated magic numbers.

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 4 |
| 🟠 Medium | 8 |
| 🟡 Low | 5 |
| **Total** | **17** |

